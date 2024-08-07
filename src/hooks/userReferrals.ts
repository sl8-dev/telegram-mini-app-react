import { useApolloClient } from '@apollo/client';
import { useState, useEffect } from 'react';
import { GET_REFERRAL_USERS } from '@/data/requests';
import { ReferralUser } from '@/data/models';

const useReferrals = () => {
  const client = useApolloClient();
  const [referralsData, setReferralsData] = useState<ReferralUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const getReferrals = async () => {
    setError(false);

    try {
      const result = await client.query<{ referralUsers: ReferralUser[] }>({
        query: GET_REFERRAL_USERS,
        fetchPolicy: 'network-only',
      });

      if (result.data && result.data.referralUsers) {
        setReferralsData(result.data.referralUsers);
      }
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReferrals();
  }, []);

  return {
    referralsData,
    loading,
    error,
  };
};

export default useReferrals;
