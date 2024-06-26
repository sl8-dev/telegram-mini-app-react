import { FC } from 'react';
import { Link } from 'react-router-dom';
import styles from './NavBar.module.css';

const NavBar: FC = () => {
  return (
    <div className={styles.navbar}>
      <Link to="/home" className={styles.navButton}>
        <span>Home</span>
      </Link>
      <Link to="/invite" className={styles.navButton}>
        <span>Invite</span>
      </Link>
      <Link to="/leaderboard" className={styles.navButton}>
        <span>Leaderboard</span>
      </Link>
      <Link to="/boosters" className={styles.navButton}>
        <span>Boosters</span>
      </Link>
    </div>
  );
};

export default NavBar;
