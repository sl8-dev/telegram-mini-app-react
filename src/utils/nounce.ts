import { TelegramGameConfig } from '@/providers';
import CryptoJS from 'crypto-js';

export type ObjectLiteral = {
  nonce: string;
  [k: string | number | symbol]: unknown;
};

export function HMAC_SHA256(key: string | CryptoJS.lib.WordArray, secret: string): CryptoJS.lib.WordArray {
  return CryptoJS.HmacSHA256(secret, key);
}

export const serializeUserConfig = (user: any): TelegramGameConfig => {
  const config: Omit<TelegramGameConfig, 'nonce'> = {
    ...user,
    maxEnergy: user.maxEnergy,
    energyRechargedAt: user.energyRechargedAt,
    weaponLevel: user.paidBoosters?.weaponLevel || 0,
    energyLimitLevel: user.paidBoosters?.energyLimitLevel || 0,
    energyRechargeLevel: user.paidBoosters?.energyRechargeLevel || 0,
    tapBotLevel: user.paidBoosters?.tapBotLevel ? 1 : 0,
    currentBoss: {
      _id: user.currentBoss.bossId,
      currentHealth: user.currentBoss.currentHealth,
      maxHealth: user.currentBoss.maxHealth,
      level: user.currentBoss.level,
    },
    freeBoosts: {
      _id: user._id,
      ...user.freeBoosts,
      refillEnergyLastActivatedAt: user.freeBoosts.refillEnergyLastActivatedAt ?? null,
      turboLastActivatedAt: user.freeBoosts.turboLastActivatedAt ?? null,
    },
  };

  const checkString = getCheckString({ ...config, nonce: '' });

  return {
    ...config,
    nonce: getHash(user._id.toString(), checkString),
  };
};

export function getHash(uniqueId: string, checkString: string): string {
  const secretKey = HMAC_SHA256('TelegramGameNonce', uniqueId);
  return HMAC_SHA256(secretKey, checkString).toString(CryptoJS.enc.Hex);
}

export function getCheckString<T extends ObjectLiteral>(data: T): string {
  return mapper(
    Object.entries(data)
      .filter(([k]) => k !== 'nonce')
      .sort(([a], [b]) => a.localeCompare(b)),
  ).join('\n');
}

export function mapper<T extends [k: string, v: unknown][]>(data: T): string[] {
  return data.map(([k, v]) => {
    if (typeof v === 'object' && v) {
      return `${k}=${mapper(Object.entries(v) as T)
        .sort(([a], [b]) => a.localeCompare(b))
        .join('\n')}`;
    }

    return `${k}=${v}`;
  });
}
