import { LangKeys } from '@/Global/Langs';
import { StatsXP } from '@/Class/Experience';
import { IntegrityToken } from '@/Class/Server';
import { AdNames } from '@/Data/App/Ads';
import { DataHashes } from '@/Data/App';
import { Activity, ActivitySaved } from '@/Data/User/Activities';
import { MissionItem } from '@/Data/User/Missions';
import { MissionKeys } from '@/Data/App/Missions';
import { ReportType } from '@/Data/App/Reports';
import { DailyQuestData } from '@/Data/User/DailyQuest';
import { AvatarObject } from '@/Data/User/Inventory';
import { Rarities } from '@/Global/Rarities';
import { LeaderboardPeriodType, LeaderboardUpdateData } from './Request_Types';

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

export interface ClientRequestAppleSigninTokenSubmit {
    action: 'apple-signin-token-submit';
    email: string;
    token: string;
    callbackID?: string;
}

export interface ClientRequestAppleSigninTokenReset {
    action: 'apple-signin-token-reset';
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

export interface ClientRequestGetAvatar {
    action: 'get-avatar';
    token: number;
    callbackID?: string;
}

export interface ClientRequestSaveAvatar {
    action: 'save-avatar';
    avatar: AvatarObject;
    token: number;
    callbackID?: string;
}

export interface ClientRequestSellStuff {
    action: 'sell-stuff';
    /** The stuff ID to sell (inventory item ID) */
    stuffID: number;
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

export interface ClientRequestBonusActivityOx {
    action: 'bonus-activity-ox';
    /** Server ID of the activity that has just been saved */
    activityID: number;
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
    /** Leaderboard updates for affected periods (weekly, monthly, yearly) */
    leaderboardUpdates?: LeaderboardUpdateData[];
    /**
     * Ox rules implemented by the client: 2 = deletions and editions cost the ox they granted, one
     * base-price operation per week then x1.5, balance may go negative. Absent for older apps
     * (legacy: the server only credits, never debits).
     */
    oxRules?: 2;
    /**
     * Signed ox change of the batch as the app computed it when the user confirmed a costly
     * operation (penalties included, catch-up credits excluded). When the server computes a
     * different amount it answers 'ox-quote-changed' instead of applying a price the user has
     * not seen. Absent when no costly operation is pending.
     */
    oxExpectedDelta?: number;
    /**
     * Identity (`id:<ID>`) of the pending deletion/edition the app quoted at base price, i.e.
     * the first costly operation confirmed while the weekly slot was available. The server gives
     * the slot to that operation when it is costly, to the largest cost otherwise.
     */
    oxFreeKey?: string;
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
// Raids
//

export interface ClientRequestGetRaid {
    action: 'get-raid';
    callbackID?: string;
}

export interface ClientRequestGetRaidLeaderboard {
    action: 'get-raid-leaderboard';
    /** Number of players to retrieve. Defaults to 100, max 100 */
    limit?: number;
    callbackID?: string;
}

export interface ClientRequestGetRaidFeed {
    action: 'get-raid-feed';
    /** Number of events to retrieve. Defaults to 50, max 100 */
    limit?: number;
    callbackID?: string;
}

export interface ClientRequestGetRaidHistory {
    action: 'get-raid-history';
    callbackID?: string;
}

export interface ClientRequestRaidHealAd {
    action: 'raid-heal-ad';
    callbackID?: string;
}

export interface ClientRequestClaimRaidReward {
    action: 'claim-raid-reward';
    /** Season whose reward is claimed: the running one, or any past one from the raid history */
    seasonID: number;
    callbackID?: string;
}

export interface ClientRequestRaidHealOx {
    action: 'raid-heal-ox';
    /** Price (ox) the user confirmed: accepted when the server price is lower or equal, 'quote-changed' otherwise */
    expectedPrice: number;
    callbackID?: string;
}

//
// Leaderboard
//

export interface ClientRequestGetLeaderboard {
    action: 'get-leaderboard';
    /** Period type to fetch. Defaults to 'weekly' if not provided */
    periodType?: LeaderboardPeriodType;
    /** Number of players to retrieve. Defaults to 10, max 100 */
    limit?: number;
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
    /** Quantity purchased (default: 1) */
    quantity?: number;
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

export interface ClientRequestBuyDailyDeal {
    action: 'buy-daily-deal';
    /** Item ID to buy */
    itemID: string;
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
    | ClientRequestAppleSigninTokenSubmit
    | ClientRequestAppleSigninTokenReset
    | ClientRequestSetLang
    | ClientRequestSetUsername
    | ClientRequestGetDevices
    | ClientRequestDeleteAccount
    | ClientRequestGetAppData
    | ClientRequestGetUserData
    | ClientRequestSetUserData
    | ClientRequestGetInventories
    | ClientRequestGetAvatar
    | ClientRequestSaveAvatar
    | ClientRequestSellStuff
    | ClientRequestGetAds
    | ClientRequestWatchAd
    | ClientRequestBonusActivityOx
    | ClientRequestCreateSkill
    | ClientRequestAddSkill
    | ClientRequestGetActivities
    | ClientRequestSaveActivities
    | ClientRequestGetAchievements
    | ClientRequestAddAchievement
    | ClientRequestClaimAchievement
    | ClientRequestGetDailyQuestToday
    | ClientRequestGetDailyQuests
    | ClientRequestSaveDailyQuests
    | ClientRequestClaimDailyQuest
    | ClientRequestGetMissions
    | ClientRequestSaveMissions
    | ClientRequestClaimMission
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
    | ClientRequestGetRaid
    | ClientRequestGetRaidLeaderboard
    | ClientRequestGetRaidFeed
    | ClientRequestGetRaidHistory
    | ClientRequestClaimRaidReward
    | ClientRequestRaidHealAd
    | ClientRequestRaidHealOx
    | ClientRequestGetLeaderboard
    | ClientRequestGetShop
    | ClientRequestBuyIAP
    | ClientRequestBuyRandomChest
    | ClientRequestBuyTargetedChest
    | ClientRequestBuyDailyDeal;
