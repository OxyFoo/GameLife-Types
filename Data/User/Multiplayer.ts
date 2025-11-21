import { StatsXP } from '@/Class/Experience';
import { CurrentActivity } from '@/Data/User/Activities';
import { AchievementItem } from '@/Data/User/Achievements';
import { CharactersID, ItemID } from '@/Data/App/Items';

export type FriendConnectionState = 'online' | 'offline';
export type FriendshipState = 'pending' | 'blocked' | 'none';
export type FriendshipStateAccepted = 'accepted';

interface UserAvatar {
    Skin: CharactersID;
    SkinColor: number;
    Hair: ItemID;
    Top: ItemID;
    Bottom: ItemID;
    Shoes: ItemID;
}

/**
 * @description Users from other accounts
 */
export class UserOnline {
    friendshipState: FriendshipState = 'none';

    status: FriendConnectionState = 'offline';
    accountID: number = 0;
    username: string = '';
    title: number = 0;
    xp: number = 0;
    avatar: UserAvatar = {
        Skin: 'human_00',
        SkinColor: 0,
        Hair: 'hair_00',
        Top: 'top_00',
        Bottom: 'bottom_00',
        Shoes: 'shoes_00'
    };
}

/** @description Class about other users, those being friends, therefore with additional information */
export class Friend {
    friendshipState: FriendshipStateAccepted = 'accepted';

    status: FriendConnectionState = 'offline';
    accountID: number = 0;
    username: string = '';
    title: number = 0;
    xp: number = 0;
    avatar: UserAvatar = {
        Skin: 'human_00',
        SkinColor: 0,
        Hair: 'hair_00',
        Top: 'top_00',
        Bottom: 'bottom_00',
        Shoes: 'shoes_00'
    };

    activities: {
        /** Number of activities */
        length: number;
        /** Total duration of activities in minutes */
        totalDuration: number;
        /** Timestamp of the first activity (in seconds, UTC) */
        firstTime: number;
    } = {
        length: 0,
        totalDuration: 0,
        firstTime: 0
    };
    stats: StatsXP = {
        int: 0,
        for: 0,
        dex: 0,
        sta: 0,
        agi: 0,
        soc: 0
    };
    achievements: AchievementItem[] = [];
    currentActivity: CurrentActivity | null = null;
}

export type SaveObject_Multiplayer = {
    friends: (Friend | UserOnline)[];
};
