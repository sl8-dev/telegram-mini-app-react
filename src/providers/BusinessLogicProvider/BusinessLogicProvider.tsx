import { createContext, FC, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { BusinessLogicContextProps } from '@/providers/BusinessLogicProvider/types.ts';

export const BusinessLogicContext = createContext<BusinessLogicContextProps | undefined>({
  tapWeight: 0,
  setTapWeight: () => undefined,

  earned: 0,
  setEarned: () => undefined,

  count: 0,
  setCount: () => undefined,

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
});

const BusinessLogicProvider: FC<PropsWithChildren> = ({ children }) => {
  const [tapWeight, setTapWeight] = useState(1);
  const [earned, setEarned] = useState(0);
  const [count, setCount] = useState(0);
  const [energy, setEnergy] = useState(1000); // TODO: get value from API or any config
  const [maxEnergy, setMaxEnergy] = useState(1000); // TODO: get value from API or any config
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isTapAreaDisabled, setIsTapAreaDisabled] = useState(false);

  const onUserTap = useCallback(() => {
    setCount((prev) => prev + 1);
    setEarned((prev) => prev + 1);
    setEnergy((prev) => prev - 1);
  }, [energy, count]);

  const providerData: BusinessLogicContextProps = {
    tapWeight,
    setTapWeight,
    earned,
    setEarned,
    count,
    setCount,
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
  };

  useEffect(() => {
    // const fetchData = setInterval(() => {
    //   // fetch data from API
    // }, 5000)
    //
    //
    // return () => clearInterval(fetchData)
  }, []);

  useEffect(() => {
    if (energy <= 0) {
      setIsTapAreaDisabled(true);
    } else {
      setIsTapAreaDisabled(false);
    }
  }, [energy]);

  return <BusinessLogicContext.Provider value={providerData}>{children}</BusinessLogicContext.Provider>;
};

export default BusinessLogicProvider;
