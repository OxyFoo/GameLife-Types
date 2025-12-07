import { LangKeys } from '@/Global/Langs';
import { StatsXP } from '@/Class/Experience';
import { IntegrityToken } from '@/Class/Server';
import { AdNames } from '@/Data/App/Ads';
import { DataHashes } from '@/Data/App';
import { Quest, QuestSaved } from '@/Data/User/Quests';
import { Todo, TodoSaved } from '@/Data/User/Todos';
import { Activity, ActivitySaved } from '@/Data/User/Activities';
import { MissionItem } from '@/Data/User/Missions';
import { MissionKeys } from '@/Data/App/Missions';
import { ReportType } from '@/Data/App/Reports';
import { DailyQuestData } from '@/Data/User/DailyQuest';
import { AvatarObject } from '@/Data/User/Inventory';
import { Rarities } from '@/Global/Rarities';

//
// Device Authentication
//

export interface ClientRequestHandshake {
    action: 'handshake';
    appVersion: string;
    callbackID?: string;
}

export interface ClientRequestCheckIntegrity {
    action: 'check-integrity';
    integrityToken: IntegrityToken | null;
    callbackID?: string;
}

export interface ClientRequestAuthenticate {
    action: 'authenticate';
    credentials: {
        UUID: string | null;
        sessionToken: string | null;
    };
    informations: {
        deviceName: string;
        OSName: string;
        OSVersion: string;
    };
    callbackID?: string;
}

export interface ClientRequestCheckDate {
    action: 'check-date';
    timestamp: number;
    callbackID?: string;
}

//
// User Authentication
//

export interface ClientRequestDisconnect {
    action: 'disconnect';
    allDevices: boolean;
    callbackID?: string;
}

export interface ClientRequestSignin {
    action: 'signin';
    email: string;
    username: string;
    lang: LangKeys;
    callbackID?: string;
}

export interface ClientRequestWaitMail {
    action: 'wait-mail';
    email: string;
    resend?: boolean;
    callbackID?: string;
}

export interface ClientRequestLogin {
    action: 'login';
    email: string;
    skipAuthentication?: boolean;
    callbackID?: string;
}

export interface ClientRequestGoogleSigninTokenSubmit {
    action: 'google-signin-token-submit';
    email: string;
    token: string;
    callbackID?: string;
}

export interface ClientRequestGoogleSigninTokenReset {
    action: 'google-signin-token-reset';
    callbackID?: string;
}

//
// Account
//

export interface ClientRequestSetLang {
    action: 'set-lang';
    lang: LangKeys;
    callbackID?: string;
}

export interface ClientRequestSetUsername {
    action: 'set-username';
    username: string;
    confirmed: boolean;
    callbackID?: string;
}

export interface ClientRequestGetDevices {
    action: 'get-devices';
    callbackID?: string;
}

export interface ClientRequestDeleteAccount {
    action: 'delete-account';
    callbackID?: string;
}

//
// Data
//

export interface ClientRequestGetAppData {
    action: 'get-app-data';
    tableHashes: DataHashes;
    callbackID?: string;
}

export interface ClientRequestGetUserData {
    action: 'get-user-data';
    callbackID?: string;
}

export interface ClientRequestSetUserData {
    action: 'set-user-data';
    titleID: number | null;
    birthtime: number | null;
    callbackID?: string;
}

export interface ClientRequestGetInventories {
    action: 'get-inventories';
    token: number;
    callbackID?: string;
}

export interface ClientRequestSaveInventories {
    action: 'save-inventories';
    avatar: AvatarObject;
    token: number;
    callbackID?: string;
}

//
// Ads
//

export interface ClientRequestGetAds {
    action: 'get-ads';
    callbackID?: string;
}

export interface ClientRequestWatchAd {
    action: 'watch-ad';
    adName: AdNames;
    callbackID?: string;
}

//
// Activities
//

export interface ClientRequestCreateSkill {
    action: 'create-skill';
    skillName: string;
    callbackID?: string;
}

export interface ClientRequestAddSkill {
    action: 'add-skill';
    encryptedSkill: string;
    shareUsername: boolean;
    callbackID?: string;
}

export interface ClientRequestGetActivities {
    action: 'get-activities';
    token: number;
    callbackID?: string;
}

export interface ClientRequestSaveActivities {
    action: 'save-activities';
    activitiesToAdd?: Activity[];
    activitiesToEdit?: ActivitySaved[];
    activitiesToDelete?: number[];
    xp: number;
    stats: StatsXP;
    token: number;
    callbackID?: string;
}

//
// Achievements
//

export interface ClientRequestGetAchievements {
    action: 'get-achievements';
    token: number;
    callbackID?: string;
}

export interface ClientRequestAddAchievement {
    action: 'save-achievements';
    achievementIDs: number[];
    token: number;
    callbackID?: string;
}

export interface ClientRequestClaimAchievement {
    action: 'claim-achievement';
    achievementID: number;
    token: number;
    callbackID?: string;
}

//
// Quests
//

export interface ClientRequestGetQuests {
    action: 'get-quests';
    token: number;
    callbackID?: string;
}

export interface ClientRequestSaveQuests {
    action: 'save-quests';
    questsToAdd: Quest[];
    questsToEdit: QuestSaved[];
    questsToDelete: number[];
    sort: number[];
    token: number;
    callbackID?: string;
}

//
// Daily Quests
//

export interface ClientRequestGetDailyQuestToday {
    action: 'get-daily-quest-today';
    callbackID?: string;
}

export interface ClientRequestGetDailyQuests {
    action: 'get-daily-quests';
    token: number;
    callbackID?: string;
}

export interface ClientRequestSaveDailyQuests {
    action: 'save-daily-quests';
    newDailyQuests: DailyQuestData[];
    token: number;
    callbackID?: string;
}

export interface ClientRequestClaimDailyQuest {
    action: 'claim-daily-quest';
    claimStart: string;
    indexesToClaim: number[];
    token: number;
    callbackID?: string;
}

//
// Missions
//

export interface ClientRequestGetMissions {
    action: 'get-missions';
    token: number;
    callbackID?: string;
}

export interface ClientRequestSaveMissions {
    action: 'save-missions';
    missions: MissionItem[];
    token: number;
    callbackID?: string;
}

export interface ClientRequestClaimMission {
    action: 'claim-mission';
    missionName: MissionKeys;
    token: number;
    callbackID?: string;
}

//
// Todos
//

export interface ClientRequestGetTodo {
    action: 'get-todo';
    token: number;
    callbackID?: string;
}

export interface ClientRequestSaveTodo {
    action: 'save-todo';
    todoToAdd?: Todo[];
    todoToEdit?: TodoSaved[];
    todoToDelete?: number[];
    newSort?: number[];
    token: number;
    callbackID?: string;
}

//
// Metrics
//

export interface ClientRequestSendError {
    action: 'send-error';
    error: string;
    callbackID?: string;
}

export interface ClientRequestSendReport {
    action: 'send-report';
    type: ReportType;
    report: object;
    callbackID?: string;
}

export interface ClientRequestSendStatistics {
    action: 'send-statistics';
    stats: {
        LoadingTimeMs?: number;
        PagesVisit?: Array<{
            name: string;
            count: number;
        }>;
        LinkClick?: string;
    };
    anonymous?: boolean;
    callbackID?: string;
}

//
// Global notifications
//

export interface ClientRequestReadGlobalNotification {
    action: 'read-global-notification';
    notificationID: number;
    callbackID?: string;
}

export interface ClientRequestRespondGlobalNotification {
    action: 'respond-global-notification';
    notificationID: number;
    response: string;
    callbackID?: string;
}

export interface ClientRequestClaimGlobalNotification {
    action: 'claim-global-notification';
    notificationID: number;
    callbackID?: string;
}

//
// Multiplayer
//

export interface ClientRequestUpdateFriends {
    action: 'update-friends';
    callbackID?: string;
}

export interface ClientRequestAddFriend {
    action: 'add-friend';
    username: string;
    callbackID?: string;
}

export interface ClientRequestAcceptFriend {
    action: 'accept-friend';
    friendID: number;
    callbackID?: string;
}

export interface ClientRequestDeclineFriend {
    action: 'decline-friend';
    friendID: number;
    callbackID?: string;
}

export interface ClientRequestCancelFriend {
    action: 'cancel-friend';
    friendID: number;
    callbackID?: string;
}

export interface ClientRequestRemoveFriend {
    action: 'remove-friend';
    friendID: number;
    callbackID?: string;
}

export interface ClientRequestBlockFriend {
    action: 'block-friend';
    friendID: number;
    callbackID?: string;
}

export interface ClientRequestUnblockFriend {
    action: 'unblock-friend';
    friendID: number;
    callbackID?: string;
}

//
// Shop
//

export interface ClientRequestGetShop {
    action: 'get-shop';
    callbackID?: string;
}

export interface ClientRequestBuyIAP {
    action: 'buy-iap';
    /** Product SKU (e.g., "ox_100") */
    sku: string;
    /** Platform: 'ios' or 'android' */
    platform: 'ios' | 'android';
    /** Transaction ID from the store */
    transactionId: string;
    /** Purchase token (Android) or receipt data (iOS) */
    purchaseToken: string;
    callbackID?: string;
}

export interface ClientRequestBuyRandomChest {
    action: 'buy-random-chest';
    /** Chest rarity to buy */
    rarity: Exclude<Rarities, 'legendary'>;
    callbackID?: string;
}

export interface ClientRequestBuyTargetedChest {
    action: 'buy-targeted-chest';
    /** Chest rarity to buy */
    rarity: Exclude<Rarities, 'legendary'>;
    /** Item slot to target */
    slot: 'hair' | 'top' | 'bottom' | 'shoes';
    callbackID?: string;
}

export type TCPClientRequest =
    | ClientRequestHandshake
    | ClientRequestCheckIntegrity
    | ClientRequestAuthenticate
    | ClientRequestCheckDate
    | ClientRequestDisconnect
    | ClientRequestSignin
    | ClientRequestWaitMail
    | ClientRequestLogin
    | ClientRequestGoogleSigninTokenSubmit
    | ClientRequestGoogleSigninTokenReset
    | ClientRequestSetLang
    | ClientRequestSetUsername
    | ClientRequestGetDevices
    | ClientRequestDeleteAccount
    | ClientRequestGetAppData
    | ClientRequestGetUserData
    | ClientRequestSetUserData
    | ClientRequestGetInventories
    | ClientRequestSaveInventories
    | ClientRequestGetAds
    | ClientRequestWatchAd
    | ClientRequestCreateSkill
    | ClientRequestAddSkill
    | ClientRequestGetActivities
    | ClientRequestSaveActivities
    | ClientRequestGetAchievements
    | ClientRequestAddAchievement
    | ClientRequestClaimAchievement
    | ClientRequestGetQuests
    | ClientRequestSaveQuests
    | ClientRequestGetDailyQuestToday
    | ClientRequestGetDailyQuests
    | ClientRequestSaveDailyQuests
    | ClientRequestClaimDailyQuest
    | ClientRequestGetMissions
    | ClientRequestSaveMissions
    | ClientRequestClaimMission
    | ClientRequestGetTodo
    | ClientRequestSaveTodo
    | ClientRequestSendError
    | ClientRequestSendReport
    | ClientRequestSendStatistics
    | ClientRequestReadGlobalNotification
    | ClientRequestRespondGlobalNotification
    | ClientRequestClaimGlobalNotification
    | ClientRequestUpdateFriends
    | ClientRequestAddFriend
    | ClientRequestAcceptFriend
    | ClientRequestDeclineFriend
    | ClientRequestCancelFriend
    | ClientRequestRemoveFriend
    | ClientRequestBlockFriend
    | ClientRequestUnblockFriend
    | ClientRequestGetShop
    | ClientRequestBuyIAP
    | ClientRequestBuyRandomChest
    | ClientRequestBuyTargetedChest;
