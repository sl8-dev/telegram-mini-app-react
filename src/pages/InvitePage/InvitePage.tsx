import { useGameData } from '@/hooks';
import { FC } from 'react';
import { toast } from 'react-toastify';
import styles from './InvitePage.module.css'; // Import the CSS module

const InvitePage: FC = () => {
  const { gameConfig } = useGameData();

  const handleCopyToClipboard = () => {
    const inviteLink = `https://t.me/gold_eagle_coin_bot?start=${gameConfig?.referralCode}`;

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
    </div>
  );
};

export default InvitePage;
