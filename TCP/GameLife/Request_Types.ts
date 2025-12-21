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
        Skin: string;
        SkinColor: number;
        Hair: string;
        Top: string;
        Bottom: string;
        Shoes: string;
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
