import { gql } from '@apollo/client';

export const GET_REFERRAL_USERS = gql`
  query ReferralUsers {
    referralUsers {
      _id
      firstname
      rewardsAmount
    }
  }
`;
