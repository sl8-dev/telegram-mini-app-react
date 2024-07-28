import { createContext, FC, useEffect, useState } from 'react';
import { isGraphqlError, transformInitData } from '@/utils';
import { useMutation } from '@apollo/client';
import { useInitData, useLaunchParams } from '@tma.js/sdk-react';
import { AccessTokenParams, LOGIN_WITH_ACCESS_TOKEN, SessionContextProps, SessionProviderProps } from '@/providers';
import { ACESS_TOKEN_STORAGE_KEY } from '@/config';

export const SessionContext = createContext<SessionContextProps | undefined>({
  sessionToken: null,
  setSessionToken: () => undefined,
  isLoading: false,
  error: '',
});

export const SessionProvider: FC<SessionProviderProps> = ({ children }) => {
  const [sessionToken, setSessionToken] = useState<string | null>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const [request] = useMutation(LOGIN_WITH_ACCESS_TOKEN);

  const initDataRaw = useLaunchParams().initDataRaw;
  const initData = useInitData();
  const transformedAuthDate = initData?.authDate ? Math.floor(initData.authDate.getTime() / 1000) : 0;

  useEffect(() => {
    if (!initData) {
      return;
    }

    const data: AccessTokenParams = {
      auth_date: transformedAuthDate,
      checkDataString: (initDataRaw && transformInitData(initDataRaw)) ?? '',
      hash: initData?.hash ?? '',
      query_id: initData?.queryId ?? '',
      user: {
        id: initData?.user?.id || 0,
        first_name: initData?.user?.firstName || '',
        last_name: initData?.user?.lastName || '',
        username: initData?.user?.username || '',
        language_code: initData?.user?.languageCode || '',
        allows_write_to_pm: initData?.user?.allowsWriteToPm || false,
      },
    };

    const handleRequest = async (webAppData: AccessTokenParams) => {
      setIsLoading(true);

      const accessToken = localStorage.getItem(ACESS_TOKEN_STORAGE_KEY);

      if (sessionToken === null) {
        await authRequest(webAppData);

        return;
      }

      if (accessToken && accessToken !== 'null') {
        return;
      }

      await authRequest(webAppData);
    };

    handleRequest(data);
  }, [initData, sessionToken]);

  const authRequest = async (webAppData: AccessTokenParams) => {
    try {
      const response = await request({
        variables: {
          webAppData,
        },
      });

      if (!response.data) {
        throw new Error('Failed load session data');
      }

      setSessionToken(response.data.telegramUserLogin.access_token);
      localStorage.setItem(ACESS_TOKEN_STORAGE_KEY, response.data.telegramUserLogin.access_token);
    } catch (error) {
      const errorMessage = isGraphqlError(error, 'FULL_MAINTENANCE') ?? (error as unknown as Error).message;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SessionContext.Provider value={{ sessionToken, setSessionToken, isLoading, error }}>
      {children}
    </SessionContext.Provider>
  );
};
