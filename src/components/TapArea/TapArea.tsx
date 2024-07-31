import React, { FC, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameData } from '@/hooks';
import styles from './TapArea.module.css';
import { useMutation } from '@apollo/client';
import { SEND_TAP_COUNT } from '@/components/TapArea/queries.ts';
import { serializeUserConfig } from '@/utils/nounce';
import { toast } from 'react-toastify';

interface Tap {
  id: number;
  x: number;
  y: number;
}

const TapArea: FC = () => {
  const [taps, setTaps] = useState<Tap[]>([]);
  const [tapCount, setTapCount] = useState(0);
  const [coinAnimation, setCoinAnimation] = useState(false);
  const { tapWeight, isTapAreaDisabled, onUserTap, gameConfig } = useGameData();
  const intervalTapCountRef = useRef<number>(0);
  const touchEventRef = useRef(false);
  const isSendingRef = useRef<boolean>(false);

  const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [sendTapCount] = useMutation(SEND_TAP_COUNT);

  const sendTapsToServer = async () => {
    try {
      const nonce = serializeUserConfig(gameConfig).nonce;

      if (intervalTapCountRef.current > 0) {
        isSendingRef.current = true;
        const currentTapCount = intervalTapCountRef.current;
        intervalTapCountRef.current = 0;

        await sendTapCount({
          variables: {
            payload: {
              tapsCount: currentTapCount,
              nonce,
            },
          },
        });
        isSendingRef.current = false;
      }
    } catch (error) {
      console.error(error);
      isSendingRef.current = false; toast.error('Failed to save your progress please try refresh app');
    }
  };

  const debounceTapsUpdate = () => {
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
      tapTimeoutRef.current = null;
    }

    const sendTaps = async () => {
      if (!isSendingRef.current && intervalTapCountRef.current > 0) {
        await sendTapsToServer();
      }
    };

    if (intervalTapCountRef.current >= 100) {
      sendTaps();
    } else {
      tapTimeoutRef.current = setTimeout(() => {
        sendTaps();
      }, 500);
    }
  };

  const preventClickAfterTouch = (e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>): boolean => {
    if ('touches' in e) {
      touchEventRef.current = true;
      e.preventDefault();
    } else if (touchEventRef.current) {
      touchEventRef.current = false;
      e.stopPropagation(); // Prevent the event from bubbling up
      return true;
    }
    return false;
  };

  const getNewTaps = (
    e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>,
    boundingRect: DOMRect,
  ): Tap[] => {
    if ('touches' in e) {
      return Array.from(e.changedTouches).map((touch, index) => ({
        id: tapCount + index,
        x: touch.clientX - boundingRect.left,
        y: touch.clientY - boundingRect.top,
      }));
    }
    return [
      {
        id: tapCount,
        x: (e as React.MouseEvent<HTMLDivElement>).clientX - boundingRect.left,
        y: (e as React.MouseEvent<HTMLDivElement>).clientY - boundingRect.top,
      },
    ];
  };

  const updateTapsAndCount = (newTaps: Tap[]) => {
    const newTapCount = newTaps.length;

    setTaps((prevTaps) => [...prevTaps, ...newTaps]);
    setTapCount((prevCount) => {
      intervalTapCountRef.current += newTapCount;
      onUserTap(newTapCount);
      return prevCount + newTapCount;
    });

    debounceTapsUpdate();
  };

  const triggerUserFeedback = () => {
    setCoinAnimation(true);
    setTimeout(() => setCoinAnimation(false), 100);
  };

  const handleTap = (e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
    if (isTapAreaDisabled) return;
    if (preventClickAfterTouch(e)) return;

    const boundingRect = e.currentTarget.getBoundingClientRect();
    const newTaps = getNewTaps(e, boundingRect);

    updateTapsAndCount(newTaps);
    triggerUserFeedback();
  };

  const handleAnimationComplete = (id: number) => {
    setTaps((prevTaps) => prevTaps.filter((tap) => tap.id !== id));
  };

  return (
    <div className={styles.tapAreaContainer} onClick={handleTap} onTouchStart={handleTap}>
      <AnimatePresence>
        <motion.img
          className={styles.tapArea}
          src={'/assets/eagle-coin.png'}
          alt={'Gold Eagle Coin'}
          animate={coinAnimation ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 0.1 }}
        />
      </AnimatePresence>

      <AnimatePresence>
        {taps.map((tap) => (
          <motion.div
            key={tap.id}
            className={styles.tapIndicator}
            initial={{ opacity: 1, scale: 1, y: 250 }}
            animate={{ opacity: 0, scale: 2, y: 150 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{ top: tap.y, left: tap.x - 15 }}
            onAnimationComplete={() => handleAnimationComplete(tap.id)}
          >
            +{tapWeight}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TapArea;
