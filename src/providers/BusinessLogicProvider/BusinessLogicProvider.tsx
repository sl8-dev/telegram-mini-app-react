import { createContext, FC, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { BusinessLogicContextProps } from '@/providers/BusinessLogicProvider/types';
import { useQuery } from '@apollo/client';
import { GET_GAME_CONFIG } from '@/providers/BusinessLogicProvider/queries';
import { ACESS_TOKEN_STORAGE_KEY } from '@/config';
import { useSession } from '@/hooks';

export const BusinessLogicContext = createContext<BusinessLogicContextProps | undefined>({
  tapWeight: 0,
  setTapWeight: () => undefined,
  earned: 0,
  setEarned: () => undefined,
  level: 0,
  setLevel: () => undefined,
  currentBossHealth: 0,
  setCurrentBossHealth: () => undefined,
  currentBossMaxHealth: 0,
  setCurrentBossMaxHealth: () => undefined,
  energy: 0,
  setEnergy: () => undefined,
  maxEnergy: 0,
  setMaxEnergy: () => undefined,
  loading: false,
  setLoading: () => undefined,
  error: '',
  setError: () => undefined,
  onUserTap: () => undefined,
  isTapAreaDisabled: false,
  setIsTapAreaDisabled: () => undefined,
  gameConfig: {
    _id: '',
    coinsAmount: 0,
    currentBoss: {
      _id: '',
      currentHealth: 0,
      level: 0,
      maxHealth: 0,
    },
    currentEnergy: 0,
    energyLimitLevel: 0,
    energyRechargeLevel: 0,
    energyRechargedAt: new Date(),
    freeBoosts: {
      currentRefillEnergyAmount: 0,
      currentTurboAmount: 0,
      maxRefillEnergyAmount: 0,
      maxTurboAmount: 0,
      refillEnergyAmountLastRechargeDate: new Date(),
      refillEnergyLastActivatedAt: new Date(),
      turboAmountLastRechargeDate: new Date(),
      turboLastActivatedAt: new Date(),
    },
    maxEnergy: 0,
    nonce: '',
    tapBotLevel: 0,
    weaponLevel: 0,
  },
  refetchGameConfig: () => undefined,
  loadingGameConfig: true,
  errorGameConfig: undefined,
});

const BusinessLogicProvider: FC<PropsWithChildren> = ({ children }) => {
  const { setSessionToken } = useSession();
  const [tapWeight, setTapWeight] = useState(1);
  const [earned, setEarned] = useState(0);
  const [level, setLevel] = useState(0);
  const [currentBossHealth, setCurrentBossHealth] = useState(0);
  const [currentBossMaxHealth, setCurrentBossMaxHealth] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [maxEnergy, setMaxEnergy] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isTapAreaDisabled, setIsTapAreaDisabled] = useState(false);

  const {
    data: initialGameConfig,
    refetch: refetchGameConfig,
    loading: loadingGameConfig,
    error: errorGameConfig,
  } = useQuery(GET_GAME_CONFIG);

  const [gameConfig, setGameConfig] = useState(initialGameConfig?.telegramGameGetConfig);

  const onUserTap = useCallback(() => {
    setEarned((prev) => prev + 1);
    setEnergy((prev) => prev - 1);
    setCurrentBossHealth((prev) => prev - 1);
  }, []);

  useEffect(() => {
    if (initialGameConfig) {
      const {
        coinsAmount,
        currentBoss: { level, currentHealth, maxHealth } = { level: 0, currentHealth: 0, maxHealth: 0 },
        maxEnergy,
        currentEnergy,
      } = initialGameConfig.telegramGameGetConfig;

      setEarned((prev) => (prev > coinsAmount ? prev : coinsAmount) ?? 0);
      setLevel(level ?? 0);
      setCurrentBossHealth(currentHealth ?? 0);
      setCurrentBossMaxHealth(maxHealth ?? 0);
      setEnergy(currentEnergy ?? 0);
      setMaxEnergy(maxEnergy ?? 0);
      setGameConfig(initialGameConfig.telegramGameGetConfig);
    }
  }, [initialGameConfig]);

  useEffect(() => {
    const energyRecovery = setInterval(() => setEnergy((prev) => (prev < maxEnergy ? prev + 1 : prev)), 1000);

    return () => clearInterval(energyRecovery);
  }, [maxEnergy]);

  useEffect(() => {
    if (energy <= 0) {
      setIsTapAreaDisabled(true);
    } else {
      setIsTapAreaDisabled(false);
    }
  }, [energy]);

  useEffect(() => {
    setGameConfig((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        coinsAmount: earned,
        currentBoss: {
          ...prev.currentBoss,
          currentHealth: currentBossHealth,
          maxHealth: currentBossMaxHealth,
        },
        currentEnergy: energy,
        maxEnergy: maxEnergy,
      };
    });
  }, [earned, currentBossHealth, currentBossMaxHealth, energy, maxEnergy]);

  useEffect(() => {
    if (errorGameConfig?.message === 'Unauthorized') {
      setSessionToken(null)
      localStorage.removeItem(ACESS_TOKEN_STORAGE_KEY);
    }
  }, [errorGameConfig]);

  const providerData: BusinessLogicContextProps = {
    tapWeight,
    setTapWeight,
    earned,
    setEarned,
    level,
    setLevel,
    currentBossHealth,
    setCurrentBossHealth,
    currentBossMaxHealth,
    setCurrentBossMaxHealth,
    energy,
    setEnergy,
    maxEnergy,
    setMaxEnergy,
    loading,
    setLoading,
    error,
    setError,
    onUserTap,
    isTapAreaDisabled,
    setIsTapAreaDisabled,
    gameConfig,
    refetchGameConfig,
    loadingGameConfig,
    errorGameConfig,
  };

  return <BusinessLogicContext.Provider value={providerData}>{children}</BusinessLogicContext.Provider>;
};

export default BusinessLogicProvider;
