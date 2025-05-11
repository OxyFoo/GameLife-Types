//import { Sexes, CharactersName } from 'Class/Inventory;
//import { AchievementItem } from 'Class/Achievements;
//import { StuffID } from 'Ressources/items/stuffs/Stuffs;

import { StatsXP } from '@/Class/Experience';
import { CurrentActivity } from '@/Data/User/Activities';
import { AchievementItem } from '@/Data/User/Achievements';

type Sexes = 'MALE' | 'FEMALE';
type CharactersName = 'skin_01';
type StuffID = 'hair_01' | 'top_01' | 'bottom_01' | 'shoes_01';

export type ConnectionState = 'online' | 'offline';
export type FriendshipState = 'pending' | 'blocked' | 'none';
export type FriendshipStateAccepted = 'accepted';

interface UserAvatar {
    Sexe: Sexes;
    Skin: CharactersName;
    SkinColor: number;
    Hair: StuffID;
    Top: StuffID;
    Bottom: StuffID;
    Shoes: StuffID;
}

/**
 * @description Users from other accounts
 */
export class UserOnline {
    friendshipState: FriendshipState = 'none';

    status: ConnectionState = 'offline';
    accountID: number = 0;
    username: string = '';
    title: number = 0;
    xp: number = 0;
    avatar: UserAvatar = {
        Sexe: 'MALE',
        Skin: 'skin_01',
        SkinColor: 0,
        Hair: 'hair_01',
        Top: 'top_01',
        Bottom: 'bottom_01',
        Shoes: 'shoes_01'
    };
}

/** @description Class about other users, those being friends, therefore with additional information */
export class Friend {
    friendshipState: FriendshipStateAccepted = 'accepted';

    status: ConnectionState = 'offline';
    accountID: number = 0;
    username: string = '';
    title: number = 0;
    xp: number = 0;
    avatar: UserAvatar = {
        Sexe: 'MALE',
        Skin: 'skin_01',
        SkinColor: 0,
        Hair: 'hair_01',
        Top: 'top_01',
        Bottom: 'bottom_01',
        Shoes: 'shoes_01'
    };

    activities: {
        /** Number of activities */
        length: number,
        /** Total duration of activities in minutes */
        totalDuration: number,
        /** Timestamp of the first activity (in seconds, UTC) */
        firstTime: number
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
    friends: (Friend | UserOnline)[]
};
