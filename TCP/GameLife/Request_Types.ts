import type { AvatarName, ItemName } from '@oxyfoo/avatar-factory';
export type { AvatarName, ItemName };

export type ConnectionState = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'wrong-ssl-pinning' | 'error';

export type ServerStatus =
    | 'offline'
    | 'ok'
    | 'free'
    | 'waitMailConfirmation'
    | 'newDevice'
    | 'remDevice'
    | 'maintenance'
    | 'update'
    | 'downdate'
    | 'limitDevice'
    | 'error';

export type LoginStatus = 'ok' | 'free' | 'waitMailConfirmation' | 'newDevice' | 'remDevice' | 'limitDevice' | 'error';

export type SigninStatus = 'ok' | 'pseudoUsed' | 'pseudoIncorrect' | 'limitAccount' | 'error';

export type LeaderboardPeriodType = 'weekly' | 'monthly' | 'yearly';

export interface LeaderboardUpdateData {
    periodType: LeaderboardPeriodType;
    /** Timestamp in seconds of the period start (Monday for weekly, 1st of month, 1st of year) */
    periodStart: number;
    /** Total XP for this period */
    xp: number;
    /** Total number of activities for this period */
    activities: number;
    /** Total time in minutes for this period */
    time: number;
}

export interface LeaderboardPlayer {
    rank: number;
    accountID: number;
    username: string;
    title: number;
    totalXP: number;
    totalActivities: number;
    totalTime: number;
    avatar: {
        Skin: AvatarName;
        SkinColor: number;
        Hair: ItemName;
        Top: ItemName;
        Bottom: ItemName;
        Shoes: ItemName;
    };
}

export interface ShopChestStats {
    priceOriginal: number;
    priceDiscount: number;
    probas: {
        common: number;
        rare: number;
        epic: number;
        legendary: number;
    };
}
