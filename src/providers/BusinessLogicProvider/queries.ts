import { gql } from '@apollo/client';

export const GET_GAME_CONFIG = gql`
  query TelegramGameGetConfig {
    telegramGameGetConfig {
      _id
      coinsAmount
      currentEnergy
      maxEnergy
      energyRechargedAt
      weaponLevel
      energyLimitLevel
      energyRechargeLevel
      tapBotLevel
      referralCode
      currentBoss {
        _id
        level
        currentHealth
        maxHealth
      }
      freeBoosts {
        _id
        currentTurboAmount
        maxTurboAmount
        turboLastActivatedAt
        turboAmountLastRechargeDate
        currentRefillEnergyAmount
        maxRefillEnergyAmount
        refillEnergyLastActivatedAt
        refillEnergyAmountLastRechargeDate
      }
      nonce
    }
  }
`;
