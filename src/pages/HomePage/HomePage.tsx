import { FC } from 'react';
import { useGameData } from '@/hooks';
import { RewardBanner, TapArea, EnergyBar, Loader } from '@/components';
import styles from './HomePage.module.css';

const HomePage: FC = () => {
  const { loadingGameConfig } = useGameData();

  if (loadingGameConfig) {
    return (
      <div className={styles.loaderContainer}>
        <Loader withText />
      </div>
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
