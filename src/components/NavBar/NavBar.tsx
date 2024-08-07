import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NavBar.module.css';
import IconButton from '../IconButton';

const NavBar: FC = () => {
  const navigate = useNavigate();

  const onDummyPage = () => {
    navigate('/dummy');
  };

  const onInvitePage = () => {
    navigate('/invite');
  };

  const onHomePage = () => {
    navigate('/');
  };

  // const onSlatePage = () => {
  //   navigate('/slate');
  // };

  // const onDebugPage = () => {
  //   navigate('/debug');
  // };

  return (
    <div className={styles.navbar}>
      <IconButton icon={'rewards'} title={'Home'} onClick={onHomePage} />
      <IconButton icon={'invite'} title={'Invite'} onClick={onInvitePage} />
      <IconButton icon={'boost'} title={'Boost'} onClick={onDummyPage} />
      <IconButton icon={'mine'} title={'Mine'} onClick={onDummyPage} />
      <IconButton icon={'fav'} title={'Wallet'} onClick={onDummyPage} />
      {/*<IconButton icon={'fav'} title={'Debug'} onClick={onDebugPage} />*/}
    </div>
  );
};

export default NavBar;
