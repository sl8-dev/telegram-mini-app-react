import { FC } from 'react';
import { useGameData } from '@/hooks';
import { RewardBanner, TapArea, EnergyBar, Loader } from '@/components';
import styles from './HomePage.module.css';
import {ACESS_TOKEN_STORAGE_KEY} from "@/config.ts";

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
    localStorage.setItem(ACESS_TOKEN_STORAGE_KEY, '')
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
