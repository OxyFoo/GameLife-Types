import { LangType } from '@/Global/Langs';
import { RawReward } from './Rewards';

export type NotificationInAppTypes = 'friend-pending' | 'achievement-pending' | 'global-message' | 'optional-update';

export enum NIA_GlobalActionType {
    NONE = 'none',
    CAN_RESPOND = 'can-respond',
    MUST_RESPOND = 'must-respond',
    OPEN_PAGE = 'open-page',
    OPEN_LINK = 'open-link',
    REWARD = 'reward'
}

interface NIA_FriendPending {
    accountID: number;
    username: string;
}

interface NIA_AchievementPending {
    achievementID: number;
}

interface NIA_GlobalMessage {
    ID: number; // Unique ID in the database
    message: LangType;
    action: NIA_GlobalActionType;
    data: string | number | RawReward[]; // Represent page name, link or rewardS
}

interface NIA_OptionalUpdate {
    version: string;
}

export type NotificationInAppDataType = {
    'friend-pending': NIA_FriendPending,
    'achievement-pending': NIA_AchievementPending,
    'global-message': NIA_GlobalMessage,
    'optional-update': NIA_OptionalUpdate
};

export class NotificationInApp<T extends keyof NotificationInAppDataType> {
    type: Readonly<T>;
    data: NotificationInAppDataType[T];
    timestamp: number = 0; // Unix timestamp in seconds (UTC)

    constructor(type: T, data: NotificationInAppDataType[T]) {
        this.type = type;
        this.data = data;
    }
}

export interface DB_NotificationInAppType {
    ID: number;
    AccountID: number;
    Action: NIA_GlobalActionType;
    Message: LangType;
    Data: string;
    Response: string;
    Readed: boolean;
    DateReaded?: Date | null;
    DaysTimeout: number;
    Date: Date;
}
