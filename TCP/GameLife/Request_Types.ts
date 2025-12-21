import { AvatarName, ItemName } from '@oxyfoo/avatar-factory';
export { AvatarName, ItemName };

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

export interface LeaderboardPlayer {
    rank: number;
    accountID: number;
    username: string;
    title: number;
    weeklyXP: number;
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
