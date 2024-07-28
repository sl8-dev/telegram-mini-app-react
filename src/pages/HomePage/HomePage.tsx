import { FC } from 'react';
import { useGameData } from '@/hooks';
import { RewardBanner, TapArea, EnergyBar, Loader } from '@/components';
import styles from './HomePage.module.css';

const HomePage: FC = () => {
  const { gameConfig, loadingGameConfig, refetchGameConfig } = useGameData();

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
