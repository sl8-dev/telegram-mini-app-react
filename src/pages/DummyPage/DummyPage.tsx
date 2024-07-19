import { FC } from 'react';
import styles from './DummyPage.module.css';

const DummyPage: FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Coming soon..</h1>
    </div>
  );
};

export default DummyPage;
