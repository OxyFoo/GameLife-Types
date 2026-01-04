import { Nullable } from '@/Global/Utils';
import { Reward } from '@/Class/Rewards';
import { ActivitySaved } from '@/Data/User/Activities';
import { TodoSaved } from '@/Data/User/Todos';
import { AchievementItem } from '@/Data/User/Achievements';
import { DataHashes, DataTypes } from '@/Data/App';
import { Account } from '@/Data/Server/Account';
import { AvatarObject, Stuff } from '@/Data/User/Inventory';
import { Ad } from '@/Data/App/Ads';
import { GeneratedSkill } from '@/Data/App/Skills';
import { QuestSaved } from '@/Data/User/Quests';
import { DailyQuestData } from '@/Data/User/DailyQuest';
import { MissionItem } from '@/Data/User/Missions';
import { Friend, UserOnline } from '@/Data/User/Multiplayer';
import { NotificationInApp, NotificationInAppDataType } from '@/Class/NotificationsInApp';
import { LeaderboardPlayer, ShopChestStats } from './Request_Types';

//
// Device Authentication
//

export interface ServerRequestHandshake {
    status: 'handshake';
    result: 'ok' | 'update' | 'update-optional' | 'downdate' | 'error';
    maintenance: boolean;
    serverVersion?: string;
    callbackID?: string;
}

export interface ServerRequestCheckIntegrity {
    status: 'check-integrity';
    result: 'ok' | 'new-integrity-token-needed' | 'error';
    challenge?: string;
    callbackID?: string;
}

export interface ServerRequestAuthenticate {
    status: 'authenticate';
    result: 'ok' | 'banned' | 'error';
    devMode?: boolean;
    newUuid?: string;
    newSessionToken?: string;
    callbackID?: string;
}

export interface ServerRequestCheckDate {
    status: 'check-date';
    dateIsValid: boolean;
    callbackID?: string;
}

//
// User Authentication
//

export interface ServerRequestDisconnect {
    status: 'disconnect';
    result: 'ok' | 'error';
    callbackID?: string;
}

export interface ServerRequestSignin {
    status: 'signin';
    result:
        | 'ok'
        | 'accountAlreadyExists'
        | 'limitAccount'
        | 'usernameAlreadyUsed'
        | 'usernameIsBlacklisted'
        | 'invalidUsername'
        | 'error';
    callbackID?: string;
}

export interface ServerRequestWaitMail {
    status: 'wait-mail';
    result: 'sent' | 'wait' | 'confirmed' | 'can-resend' | 'error';
    remainingTime?: number;
    callbackID?: string;
}

export interface ServerRequestLogin {
    status: 'login';
    result:
        | 'free'
        | 'mailNotSent'
        | 'deviceLimitReached'
        | 'waitMailConfirmation'
        | 'error'
        | {
              banned: boolean;
          };
    callbackID?: string;
}

export interface ServerRequestGoogleSigninTokenSubmit {
    status: 'google-signin-token-submit';
    result: 'can-signin' | 'can-login' | 'invalid' | 'error';
    callbackID?: string;
}

export interface ServerRequestGoogleSigninTokenReset {
    status: 'google-signin-token-reset';
    result: 'ok' | 'error';
    callbackID?: string;
}

export interface ServerRequestAppleSigninTokenSubmit {
    status: 'apple-signin-token-submit';
    result: 'can-signin' | 'can-login' | 'invalid' | 'error';
    callbackID?: string;
}

export interface ServerRequestAppleSigninTokenReset {
    status: 'apple-signin-token-reset';
    result: 'ok' | 'error';
    callbackID?: string;
}

//
// Account
//

export interface ServerRequestSetLang {
    status: 'set-lang';
    result: 'ok' | 'error';
    callbackID?: string;
}

export interface ServerRequestSetUsername {
    status: 'set-username';
    result:
        | 'ok'
        | 'okButNotConfirmed'
        | 'usernameIsAlreadyUsed'
        | 'usernameIsAlreadyChanged'
        | 'invalidUsername'
        | 'error';
    callbackID?: string;
}

export interface ServerRequestGetDevices {
    status: 'get-devices';
    result: 'ok' | 'error';
    devices?: {
        deviceName: string;
        OSName: string;
        OSVersion: string;
        created: Date;
        banned: boolean;
    }[];
    callbackID?: string;
}

export interface ServerRequestDeleteAccount {
    status: 'delete-account';
    result: 'ok' | 'error';
    callbackID?: string;
}

//
// Data
//

export interface ServerRequestGetAppData {
    status: 'get-app-data';
    result: 'ok' | 'error';
    data: Nullable<DataTypes> | null;
    hashes: DataHashes | null;
    iapSkus?: string[];
    callbackID?: string;
}

export interface ServerRequestGetUserData {
    status: 'get-user-data';
    result: 'ok' | 'error';
    data: Account | null;
    callbackID?: string;
}

export interface ServerRequestSetUserData {
    status: 'set-user-data';
    result: 'ok' | 'error';
    callbackID?: string;
}

export interface ServerRequestGetInventories {
    status: 'get-inventories';
    result:
        | 'error'
        | 'already-up-to-date'
        | {
              titleIDs: number[];
              stuffs: Stuff[];
              token: number;
          };
    callbackID?: string;
}

export interface ServerRequestGetAvatar {
    status: 'get-avatar';
    result:
        | 'error'
        | 'already-up-to-date'
        | {
              avatar: AvatarObject;
              token: number;
          };
    callbackID?: string;
}

export interface ServerRequestSaveAvatar {
    status: 'save-avatar';
    result: 'error' | { token: number };
    callbackID?: string;
}

//
// Ads
//

export interface ServerRequestGetAds {
    status: 'get-ads';
    result: 'ok' | 'error';
    ads: Ad[];
    callbackID?: string;
}

export interface ServerRequestWatchAd {
    status: 'watch-ad';
    result: 'ok' | 'error' | 'limit-reached';
    ox?: number;
    adRemaining?: number;
    callbackID?: string;
}

//
// Activities
//

export interface ServerRequestCreateSkill {
    status: 'create-skill';
    result:
        | 'error'
        | 'skill-already-exists'
        | 'cant-generate'
        | 'feature-disabled'
        | {
              generatedSkill: GeneratedSkill;
              encryptedSkill: string;
          };
    callbackID?: string;
}

export interface ServerRequestAddSkill {
    status: 'add-skill';
    result: 'ok' | 'skill-already-exists' | 'invalid-skill' | 'error';
    callbackID?: string;
}

export interface ServerRequestGetActivities {
    status: 'get-activities';
    result:
        | 'error'
        | 'already-up-to-date'
        | {
              activities: ActivitySaved[];
              token: number;
          };
    callbackID?: string;
}

export interface ServerRequestSaveActivities {
    status: 'save-activities';
    result:
        | 'wrong-activities'
        | 'not-up-to-date'
        | 'error'
        | {
              newActivities: ActivitySaved[];
              token: number;
          };
    callbackID?: string;
}

//
// Achievements
//

export interface ServerRequestGetAchievements {
    status: 'get-achievements';
    result:
        | 'error'
        | 'already-up-to-date'
        | {
              achievements: AchievementItem[];
              token: number;
          };
    callbackID?: string;
}

export interface ServerRequestAddAchievement {
    status: 'save-achievements';
    result:
        | 'error'
        | 'wrong-achievements'
        | 'not-up-to-date'
        | {
              newAchievements: AchievementItem[];
              token: number;
          };
    callbackID?: string;
}

export interface ServerRequestClaimAchievement {
    status: 'claim-achievement';
    result:
        | 'error'
        | 'not-up-to-date'
        | {
              rewards: Reward[];
              newOx: number;
              token: number;
          };
    callbackID?: string;
}

//
// Quests
//

export interface ServerRequestGetQuests {
    status: 'get-quests';
    result:
        | 'error'
        | 'already-up-to-date'
        | {
              quests: QuestSaved[];
              sort: number[];
              token: number;
          };
    callbackID?: string;
}

export interface ServerRequestSaveQuests {
    status: 'save-quests';
    result:
        | 'wrong-quests'
        | 'not-up-to-date'
        | 'error'
        | {
              newQuests: QuestSaved[];
              token: number;
          };
    callbackID?: string;
}

//
// Daily Quests
//

export interface ServerRequestGetDailyQuestToday {
    status: 'get-daily-quest-today';
    result: 'error' | { categoryID: number };
    callbackID?: string;
}

export interface ServerRequestGetDailyQuests {
    status: 'get-daily-quests';
    result:
        | 'error'
        | 'already-up-to-date'
        | {
              claimData: DailyQuestData[];
              token: number;
          };
    callbackID?: string;
}

export interface ServerRequestSaveDailyQuests {
    status: 'save-daily-quests';
    result:
        | 'error'
        | 'wrong-daily-quests'
        | 'not-up-to-date'
        | {
              newDailyQuests: DailyQuestData[];
              token: number;
          };
    callbackID?: string;
}

export interface ServerRequestClaimDailyQuest {
    status: 'claim-daily-quest';
    result:
        | 'error'
        | 'wrong-daily-quests'
        | 'not-up-to-date'
        | {
              dayIndexes: number[];
              rewards: Reward[];
              newOx: number;
              token: number;
          };
    callbackID?: string;
}

//
// Missions
//

export interface ServerRequestGetMissions {
    status: 'get-missions';
    result:
        | 'error'
        | 'already-up-to-date'
        | {
              missions: MissionItem[];
              token: number;
          };
    callbackID?: string;
}

export interface ServerRequestSaveMissions {
    status: 'save-missions';
    result:
        | 'wrong-missions'
        | 'not-up-to-date'
        | 'error'
        | {
              token: number;
          };
    callbackID?: string;
}

export interface ServerRequestClaimMission {
    status: 'claim-mission';
    result:
        | 'error'
        | 'already-claimed'
        | 'not-up-to-date'
        | {
              rewards: Reward[];
              newOx: number;
              newToken: number;
          };
    callbackID?: string;
}

//
// Todo
//

export interface ServerRequestGetTodo {
    status: 'get-todo';
    result:
        | 'error'
        | 'already-up-to-date'
        | {
              todo: TodoSaved[];
              sort: number[];
              token: number;
          };
    callbackID?: string;
}

export interface ServerRequestSaveTodo {
    status: 'save-todo';
    result:
        | 'error'
        | 'not-up-to-date'
        | 'wrong-todo'
        | {
              newTodos: TodoSaved[];
              token: number;
          };
    callbackID?: string;
}

//
// Notifications
//

export interface ServerRequestUpdateNotifications {
    status: 'update-notifications';
    notifications: NotificationInApp<keyof NotificationInAppDataType>[];
    callbackID?: string;
}

//
// Metrics
//

export interface ServerRequestSendError {
    status: 'send-error';
    result: 'ok' | 'error';
    callbackID?: string;
}

export interface ServerRequestSendReport {
    status: 'send-report';
    result: 'ok' | 'error';
    callbackID?: string;
}

export interface ServerRequestSendStatistics {
    status: 'send-statistics';
    result: 'ok' | 'error';
    callbackID?: string;
}

//
// Global notifications
//

export interface ServerRequestReadGlobalNotification {
    status: 'read-global-notification';
    result: 'ok' | 'not-found' | 'error';
    callbackID?: string;
}

export interface ServerRequestRespondGlobalNotification {
    status: 'respond-global-notification';
    result: 'ok' | 'not-found' | 'error';
    callbackID?: string;
}

export interface ServerRequestClaimGlobalNotification {
    status: 'claim-global-notification';
    result:
        | 'error'
        | 'not-found'
        | {
              rewards: Reward[];
          };
    callbackID?: string;
}

//
// Multiplayer
//

export interface ServerRequestUpdateFriends {
    status: 'update-friends';
    result:
        | 'error'
        | {
              friends: (UserOnline | Friend)[];
              friendIDsToUpdate: number[];
          };
    callbackID?: string;
}

export interface ServerRequestAddFriend {
    status: 'add-friend';
    result: 'ok' | 'self' | 'already-friend' | 'already-pending' | 'blocked' | 'not-found' | 'error';
    callbackID?: string;
}

export interface ServerRequestAcceptFriend {
    status: 'accept-friend';
    result: 'ok' | 'not-pending' | 'error';
    callbackID?: string;
}

export interface ServerRequestDeclineFriend {
    status: 'decline-friend';
    result: 'ok' | 'not-pending' | 'error';
    callbackID?: string;
}

export interface ServerRequestCancelFriend {
    status: 'cancel-friend';
    result: 'ok' | 'not-pending' | 'error';
    callbackID?: string;
}

export interface ServerRequestRemoveFriend {
    status: 'remove-friend';
    result: 'ok' | 'not-friend' | 'error';
    callbackID?: string;
}

export interface ServerRequestBlockFriend {
    status: 'block-friend';
    result: 'ok' | 'not-friend' | 'error';
    callbackID?: string;
}

export interface ServerRequestUnblockFriend {
    status: 'unblock-friend';
    result: 'ok' | 'not-friend' | 'error';
    callbackID?: string;
}

//
// Leaderboard
//

export interface ServerRequestGetLeaderboard {
    status: 'get-leaderboard';
    result:
        | 'error'
        | {
              /** Top players by weekly XP */
              players: LeaderboardPlayer[];
              /** Current user's data if not in top 30, null otherwise */
              self: LeaderboardPlayer | null;
              /** Timestamp of the last Monday (start of the week) in seconds UTC */
              weekStart: number;
          };
    callbackID?: string;
}

//
// Shop
//

export interface ServerRequestGetShop {
    status: 'get-shop';
    result: 'error' | 'ok';
    dailyDeals?: string[];
    chestsStats?: {
        random: {
            common: ShopChestStats;
            rare: ShopChestStats;
            epic: ShopChestStats;
        };
        target: {
            common: ShopChestStats;
            rare: ShopChestStats;
            epic: ShopChestStats;
        };
    };
    callbackID?: string;
}

export interface ServerRequestBuyIAP {
    status: 'buy-iap';
    result: 'ok' | 'invalid-sku' | 'invalid-receipt' | 'already-processed' | 'verification-failed' | 'error';
    /** New total Ox amount after purchase */
    ox?: number;
    /** Amount of Ox added by this purchase */
    addedOx?: number;
    callbackID?: string;
}

export interface ServerRequestBuyRandomChest {
    status: 'buy-random-chest';
    result: 'ok' | 'invalid-rarity' | 'not-enough-ox' | 'no-items-available' | 'error';
    /** New total Ox amount after purchase */
    ox?: number;
    /** New item received from chest */
    newItem?: Stuff;
    callbackID?: string;
}

export interface ServerRequestBuyTargetedChest {
    status: 'buy-targeted-chest';
    result: 'ok' | 'invalid-rarity' | 'invalid-slot' | 'not-enough-ox' | 'no-items-available' | 'error';
    /** New total Ox amount after purchase */
    ox?: number;
    /** New item received from chest */
    newItem?: Stuff;
    callbackID?: string;
}

export interface ServerRequestBuyDailyDeal {
    status: 'buy-daily-deal';
    result: 'ok' | 'invalid-item' | 'item-not-available' | 'already-purchased' | 'not-enough-ox' | 'error';
    /** New total Ox amount after purchase */
    ox?: number;
    /** New item received */
    newItem?: Stuff;
    callbackID?: string;
}

export interface ServerRequestSellStuff {
    status: 'sell-stuff';
    result: 'ok' | 'invalid-item' | 'item-not-found' | 'item-equipped' | 'error';
    /** New total Ox amount after sell */
    ox?: number;
    callbackID?: string;
}

export type TCPServerRequest =
    | ServerRequestHandshake
    | ServerRequestCheckIntegrity
    | ServerRequestAuthenticate
    | ServerRequestCheckDate
    | ServerRequestDisconnect
    | ServerRequestSignin
    | ServerRequestLogin
    | ServerRequestGoogleSigninTokenSubmit
    | ServerRequestGoogleSigninTokenReset
    | ServerRequestAppleSigninTokenSubmit
    | ServerRequestAppleSigninTokenReset
    | ServerRequestSetLang
    | ServerRequestSetUsername
    | ServerRequestGetDevices
    | ServerRequestDeleteAccount
    | ServerRequestWaitMail
    | ServerRequestGetAppData
    | ServerRequestGetUserData
    | ServerRequestSetUserData
    | ServerRequestGetInventories
    | ServerRequestGetAvatar
    | ServerRequestSaveAvatar
    | ServerRequestGetAds
    | ServerRequestWatchAd
    | ServerRequestCreateSkill
    | ServerRequestAddSkill
    | ServerRequestGetActivities
    | ServerRequestSaveActivities
    | ServerRequestGetAchievements
    | ServerRequestAddAchievement
    | ServerRequestClaimAchievement
    | ServerRequestGetQuests
    | ServerRequestSaveQuests
    | ServerRequestGetDailyQuestToday
    | ServerRequestGetDailyQuests
    | ServerRequestSaveDailyQuests
    | ServerRequestClaimDailyQuest
    | ServerRequestGetMissions
    | ServerRequestSaveMissions
    | ServerRequestClaimMission
    | ServerRequestGetTodo
    | ServerRequestSaveTodo
    | ServerRequestUpdateNotifications
    | ServerRequestSendError
    | ServerRequestSendReport
    | ServerRequestSendStatistics
    | ServerRequestReadGlobalNotification
    | ServerRequestRespondGlobalNotification
    | ServerRequestClaimGlobalNotification
    | ServerRequestUpdateFriends
    | ServerRequestAddFriend
    | ServerRequestAcceptFriend
    | ServerRequestDeclineFriend
    | ServerRequestCancelFriend
    | ServerRequestRemoveFriend
    | ServerRequestBlockFriend
    | ServerRequestUnblockFriend
    | ServerRequestGetLeaderboard
    | ServerRequestGetShop
    | ServerRequestBuyIAP
    | ServerRequestBuyRandomChest
    | ServerRequestBuyTargetedChest
    | ServerRequestBuyDailyDeal
    | ServerRequestSellStuff;
