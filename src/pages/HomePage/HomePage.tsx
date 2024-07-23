import { FC } from 'react';
import { useGameData } from '@/hooks';
import { RewardBanner, TapArea, EnergyBar, Loader } from '@/components';
import styles from './HomePage.module.css';

const HomePage: FC = () => {
  const { gameConfig, loadingGameConfig, errorGameConfig } = useGameData();

  if (loadingGameConfig) {
    return (
      <div className={styles.loaderContainer}>
        <Loader withText />
      </div>
    );
  }

  if (errorGameConfig) {
    window.location.href = '/';
    return null;
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
