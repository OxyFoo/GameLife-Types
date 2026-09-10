import { LangType } from '@/Global/Langs';
import { RawReward } from '@/Class/Rewards';
import { StatsXP } from '@/Class/Experience';
import { LeaderboardPlayer } from '@/TCP/GameLife/Request_Types';

/**
 * Raids: a monthly world boss every player of level 10+ fights with real-life activities.
 * The rules live in a pure engine mirrored on both sides (server `RaidEngine.ts`, app `raidEngine.js`);
 * the server is authoritative, the app only previews.
 */

export type RaidDifficulty = 'easy' | 'normal' | 'hard';

export type RaidPhaseKind = 'fight' | 'heal';

export type RaidSkipKind = 'ad' | 'ox';

/** Rank trend since the last daily snapshot */
export type RaidTrend = 'up' | 'down' | 'same' | 'new';

/**
 * - `ok`: the account takes part in the current season
 * - `locked`: below level 10 (the public season is still sent for the skeleton card)
 * - `no-season`: no boss right now ("heroes' rest"), see `nextSeasonAt`
 */
export type RaidState = 'ok' | 'locked' | 'no-season';

/**
 * - `none`: nothing to claim (no damage dealt, empty reward list, or season not settled yet)
 * - `claimable`: the boss is down or the season is closed, the reward waits in the raid history
 * - `claimed`: already taken
 */
export type RaidRewardState = 'none' | 'claimable' | 'claimed';

export type RaidAvatar = LeaderboardPlayer['avatar'];

export interface RaidSeasonPublic {
    id: number;
    /** Season number, 1-based, set by the admin */
    number: number;
    name: LangType;
    description: LangType;
    bossName: LangType;
    difficulty: RaidDifficulty;
    /**
     * Key of the season visual in the app registry (`res/raids/raids.js`), e.g. 'desert-de-feu'.
     * It carries both images, boss and background; an unknown key falls back to the generic pair.
     */
    imageID: string;
    /** Rewards when the boss is defeated */
    rewards: RawReward[];
    /** Rewards when the boss survives (empty: nothing) */
    consolationRewards: RawReward[];
    /** Unix seconds, 1st of the month 00:00 UTC */
    startTime: number;
    /** Unix seconds, 1st of the next month 00:00 UTC (end of scoring) */
    endTime: number;
    hpPerParticipant: number;
    /** Accounts enrolled in the season (display only) */
    participantsCount: number;
    /** Ratio registry [0;1]: every damage delta adds d / maxHP(at that instant), so the bar ignores participant flows */
    progress: number;
    /** floor(progress * maxHP) */
    hp: number;
    /** hpPerParticipant * max(scoringCount, minParticipants) */
    maxHP: number;
    /** Unix seconds, null while the boss stands */
    defeatedAt: number | null;
    /** Unix seconds, null until the rewards are distributed (endTime + grace) */
    closedAt: number | null;
}

/** Engine input: one useful activity (already filtered by the ox rules) */
export interface RaidActivity {
    /** Database ID, null for an activity not saved yet (app preview only) */
    id: number | null;
    skillID: number;
    /** Unix seconds */
    startTime: number;
    /** Minutes */
    duration: number;
}

export interface RaidSkip {
    id: number;
    /** Unix seconds when the skip was bought */
    time: number;
    /** Minutes removed from the heal phase */
    minutes: number;
    kind: RaidSkipKind;
    /** Start of the heal phase it was bought in: one skip per kind and per phase, compared exactly */
    phaseStart: number;
}

/**
 * What the simulation reads of a skip. `phaseStart` is deliberately absent: the engine re-derives
 * the phase from `time` and refunds a skip whose phase moved away (`unusedSkipIDs`), so it must
 * never trust the phase stored on the row.
 */
export type RaidSkipInput = Pick<RaidSkip, 'id' | 'time' | 'minutes'>;

export interface RaidPhase {
    kind: RaidPhaseKind;
    /** Unix seconds */
    start: number;
    /** Unix seconds, null for the open fight phase */
    end: number | null;
}

export interface RaidHit {
    /** null for an activity not saved yet (app preview only) */
    activityID: number | null;
    startTime: number;
    skillID: number;
    /** Minutes actually scored: intersection with the fight phases, capped by the budget */
    minutes: number;
    points: number;
    critical: boolean;
}

export interface RaidCurrentPhase {
    kind: RaidPhaseKind;
    start: number;
    /** Unix seconds: heal end, or null while fighting */
    end: number | null;
    /** Minutes of useful activity per fight phase (BudgetMinutes) */
    budgetTotal: number;
    /** Minutes already scored in the current fight (equals budgetTotal while healing) */
    budgetUsed: number;
}

export interface RaidSimulation {
    phases: RaidPhase[];
    hits: RaidHit[];
    totals: {
        damage: number;
        hits: number;
        criticals: number;
        minutes: number;
    };
    current: RaidCurrentPhase;
    /** Skips the fold did not consume (their heal phase moved): refunded by the server */
    unusedSkipIDs: number[];
}

export interface RaidParticipantSelf {
    joinedAt: number;
    active: boolean;
    /** Stats frozen for the season when the account enrolled (computed by the server) */
    stats: StatsXP;
    /** Level computed by the server from the activities */
    level: number;
    damage: number;
    hits: number;
    criticals: number;
    minutes: number;
    /** 1-based rank among active participants with damage > 0, null when damage = 0 */
    rank: number | null;
    prevRank: number | null;
    trend: RaidTrend;
    /** Rewards of the running season, claimable as soon as the boss is defeated */
    rewardState: RaidRewardState;
    simulation: RaidSimulation;
}

export interface RaidLeaderboardPlayer {
    rank: number;
    accountID: number;
    username: string;
    title: number;
    avatar: RaidAvatar;
    damage: number;
    hits: number;
    criticals: number;
    phase: RaidPhaseKind;
    trend: RaidTrend;
}

export type RaidFeedData = {
    'level-up': { from: number; to: number };
    achievement: { achievementID: number };
    /** No skill nor comment: activities are private */
    'raid-critical': { seasonNumber: number; points: number; minutes: number; activityID: number };
    'raid-rank': { seasonNumber: number; rank: number; threshold: 1 | 3 | 10 };
};

export type RaidFeedType = keyof RaidFeedData;

export interface RaidFeedEvent<T extends RaidFeedType = RaidFeedType> {
    id: number;
    accountID: number;
    username: string;
    title: number;
    type: T;
    data: RaidFeedData[T];
    /** Unix seconds */
    time: number;
}

export interface RaidHistoryEntry {
    /** Season ID, needed to claim its reward */
    id: number;
    number: number;
    name: LangType;
    bossName: LangType;
    difficulty: RaidDifficulty;
    /** Key of the season visual, see `RaidSeasonPublic.imageID` */
    imageID: string;
    startTime: number;
    endTime: number;
    defeated: boolean;
    participantsCount: number;
    progress: number;
    /** Rewards that apply: the full list when the boss went down, the consolation one otherwise */
    rewards: RawReward[];
    rewardState: RaidRewardState;
    /** null when the account did not take part */
    self: {
        damage: number;
        hits: number;
        criticals: number;
        minutes: number;
        finalRank: number | null;
    } | null;
}

/** Payload of `get-raid` (and the app's local cache) */
export interface RaidStatePayload {
    state: RaidState;
    /** Public season, also sent with 'locked' */
    season: RaidSeasonPublic | null;
    /** null with 'locked' and 'no-season' */
    self: RaidParticipantSelf | null;
    /** Skips of the account for this season (not refunded) */
    skips: RaidSkip[];
    accountID: number;
    /** Unix seconds of the next activation, null when no season is pending */
    nextSeasonAt: number | null;
    /** Server clock, to compute countdowns without trusting the device clock */
    serverTime: number;
    /** Heal ads left today */
    healAdRemaining: number;
}

export type SaveObject_Raids = {
    /** Last `get-raid` payload, for the offline widget */
    cache: RaidStatePayload | null;
    /** Unix seconds of the last successful `get-raid` */
    fetchedAt: number;
};
