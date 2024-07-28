import { FC } from 'react';
import { useGameData, useSession } from '@/hooks';
import { RewardBanner, TapArea, EnergyBar, Loader } from '@/components';
import styles from './HomePage.module.css';

const HomePage: FC = () => {
  const { gameConfig, loadingGameConfig, refetchGameConfig, errorGameConfig } = useGameData();
  const { sessionToken } = useSession()

  if (loadingGameConfig) {
    return (
      <div className={styles.loaderContainer}>
        <Loader withText />
      </div>
    );
  }
  const refresh = async () => {
    await refetchGameConfig();
  };

  if (!gameConfig) {
    return (
      <h1>
        Something went wrong. Please try again.
        error: { errorGameConfig?.message }
        token: { sessionToken }

        <button className="button" onClick={refresh}>
          Click here to refresh
        </button>
      </h1>
    );
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

