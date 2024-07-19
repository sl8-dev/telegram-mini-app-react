import { FC } from 'react';
import styles from './Loader.module.css';

interface Props {
  withText?: boolean;
}

const Loader: FC<Props> = ({withText}) => {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}>
        <div className={styles.doubleBounce1}></div>
        <div className={styles.doubleBounce2}></div>
      </div>

      {withText && <span className={styles.label}>Loading...</span>}
    </div>
  );
};

export default Loader;
