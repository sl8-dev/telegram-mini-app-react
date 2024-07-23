import { FC, useState } from 'react';
import { useGameData, useSession } from '@/hooks';
import { RewardBanner, TapArea, EnergyBar, Loader, Button } from '@/components';
import styles from './HomePage.module.css';
import { AccessTokenParams, LOGIN_WITH_ACCESS_TOKEN } from '@/providers';
import { transformInitData } from '@/utils';
import { ACESS_TOKEN_STORAGE_KEY } from '@/config.ts';
import { useInitData, useLaunchParams } from '@tma.js/sdk-react';
import { useMutation } from '@apollo/client';

const HomePage: FC = () => {
  const { gameConfig, loadingGameConfig, errorGameConfig } = useGameData();
  const initDataRaw = useLaunchParams().initDataRaw;
  const initData = useInitData();
  const [request] = useMutation(LOGIN_WITH_ACCESS_TOKEN);
  const [loading, setLoading] = useState(false);
  const { sessionToken } = useSession();

  const transformedAuthDate = initData?.authDate ? Math.floor(initData.authDate.getTime() / 1000) : 0;

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

  const handleLoginRequest = async (webAppData: AccessTokenParams) => {
    setLoading(true);

    const accessToken = localStorage.getItem(ACESS_TOKEN_STORAGE_KEY);

    if (accessToken) {
      localStorage.setItem(ACESS_TOKEN_STORAGE_KEY, accessToken);
      return;
    }

    if (sessionToken) {
      localStorage.setItem(ACESS_TOKEN_STORAGE_KEY, sessionToken);
      return;
    }

    try {
      const response = await request({
        variables: {
          webAppData,
        },
      });

      if (!response.data) {
        throw new Error('Failed load session data');
      }

      localStorage.setItem(ACESS_TOKEN_STORAGE_KEY, response.data.telegramUserLogin.access_token);
    } catch (error) {
      // const errorMessage = isGraphqlError(error, 'FULL_MAINTENANCE') ?? (error as unknown as Error).message;
      setError(JSON.stringify(error, null, 2));
    } finally {
      setLoading(false);
    }
  };

  if (loadingGameConfig || loading) {
    return (
      <div className={styles.loaderContainer}>
        <Loader withText />
      </div>
    );
  }

  if (errorGameConfig) {
    return (
      <div className={styles.errorContainer}>
        <h1>{errorGameConfig.message}</h1>
        <Button text={'Try again'} onClick={() => handleLoginRequest(data)} />
      </div>
    );
  }

  if (!gameConfig) {
    return <h1>Something went wrong. Try again later.</h1>;
  }

  return (
    <div className={styles.container}>
      <RewardBanner />
      <EnergyBar />
      <TapArea />
    </div>
  );
};

export default HomePage;
