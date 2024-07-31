import { createContext, FC, useState } from 'react';
import { isGraphqlError, transformInitData } from '@/utils';
import { useMutation } from '@apollo/client';
import { useInitData, useLaunchParams } from '@telegram-apps/sdk-react';
import { AccessTokenParams, LOGIN_WITH_ACCESS_TOKEN, SessionContextProps, SessionProviderProps } from '@/providers';
import { ACESS_TOKEN_STORAGE_KEY } from '@/config';

export const SessionContext = createContext<SessionContextProps | undefined>({
  sessionToken: null,
  setSessionToken: () => undefined,
  refetchSession: () => undefined,
  isLoading: false,
  error: '',
});

export const SessionProvider: FC<SessionProviderProps> = ({ children }) => {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const [request] = useMutation(LOGIN_WITH_ACCESS_TOKEN);

  const initDataRaw = useLaunchParams().initDataRaw;
  const initData = useInitData();
  const transformedAuthDate = initData?.authDate ? Math.floor(initData.authDate.getTime() / 1000) : 0;

  const authRequest = async (webAppData: AccessTokenParams) => {
    try {
      const localStorageSessionToken = localStorage.getItem(ACESS_TOKEN_STORAGE_KEY);
      console.log('called: ', sessionToken, localStorageSessionToken);

      if (sessionToken !== null || localStorageSessionToken) return;

      setIsLoading(true);
      const response = await request({
        variables: {
          webAppData,
        },
      });

      if (!response.data) {
        throw new Error('Failed to load session data');
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

  const refetchSession = async () => {
    if (!initData) return;
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
    await authRequest(data);
  };

  return (
    <SessionContext.Provider value={{ sessionToken, setSessionToken, isLoading, error, refetchSession }}>
      {children}
    </SessionContext.Provider>
  );
};
