import { useGameData } from '@/hooks';
import { FC } from 'react';
import { toast } from 'react-toastify';
import styles from './InvitePage.module.css';
import useReferrals from '@/hooks/userReferrals';
import { ReferralUser } from '@/data/models';
import { Loader } from '@/components';

const InvitePage: FC = () => {
  const { gameConfig } = useGameData();
  const { referralsData, loading } = useReferrals();

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <Loader withText />
      </div>
    );
  }

  const totalReferrals = referralsData ? referralsData.length : 0;
  const totalRewards = referralsData ? referralsData.reduce((acc, referral) => acc + referral.rewardsAmount, 0) : 0;

  const handleCopyToClipboard = () => {
    const inviteLink = `https://t.me/gold_eagle_coin_bot?start=r_${gameConfig?.referralCode}`;

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(inviteLink)
        .then(() => {
          toast.success('Invite link copied to clipboard!');
        })
        .catch((err) => {
          console.error('Failed to copy invite link: ', err);
          fallbackCopyTextToClipboard(inviteLink);
        });
    } else {
      fallbackCopyTextToClipboard(inviteLink);
    }
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      const msg = successful ? 'Invite link copied to clipboard!' : 'Failed to copy invite link';
      toast.success(msg);
    } catch (err) {
      console.error('Fallback: Failed to copy text: ', err);
      toast.error('Failed to copy invite link');
    }

    document.body.removeChild(textArea);
  };

  return (
    <div className={styles.container}>
      <div className={styles.inviteBox}>
        <div className={styles.header}>
          <img src="/assets/invite.svg" alt="Invite Icon" className={styles.icon} />
          <div>
            <h1 className={styles.title}>INVITE LINK</h1>
            <p className={styles.subtitle}>Invite your frens and get bonuses!</p>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.inviteButton} onClick={handleCopyToClipboard}>
            INVITE FRENS
          </button>
          <button className={styles.copyButton} onClick={handleCopyToClipboard}>
            <img src="/assets/copy.svg" alt="Copy Icon" />
          </button>
        </div>
      </div>

      <div className={styles.referralsContainer}>
        <h2 className={styles.referralsTitle}>REFERRALS {totalReferrals > 0 && `(${totalReferrals})`}</h2>
        <p>
          You will receive 6% of your frens taps. Here is the list of your frens:
          <br />
          Total rewards: <strong>{totalRewards.toLocaleString()}</strong> 🪙
        </p>
        {referralsData && referralsData.length > 0 ? (
          [...referralsData]
            .sort((a, b) => b.rewardsAmount - a.rewardsAmount)
            .map((referral: ReferralUser) => (
              <div key={referral._id} className={styles.referralItem}>
                <div className={styles.referralHeader}>
                  <img className={styles.avatar} src={'/assets/eagle-user.png'} alt={'Gold icon'} />
                  <div className={styles.referralInfo}>
                    <span className={styles.referralName}>{referral.firstname}</span>
                  </div>
                </div>
                <div className={styles.referralRewards}>
                  <span className={styles.rewardsAmount}>+{referral.rewardsAmount.toLocaleString()} 🪙</span>
                </div>
              </div>
            ))
        ) : (
          <p>No referrals yet.</p>
        )}
      </div>
    </div>
  );
};

export default InvitePage;
