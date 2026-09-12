/**
 * Pure rules of the raids — no I/O, deterministic.
 *
 * Shipped by the shared package on purpose: the app previews a phase, a budget and points, the server
 * applies them, and both import this very module. The server stays authoritative for what it alone
 * knows (critical draw seed, boss progress); the app only previews.
 *
 * Rules (product owner, 2026-09-08):
 * - A season is a whole UTC month; every account of level 10+ takes part automatically.
 * - Only useful activities score (same rule as the ox: `OxEconomy.UsefulActivities`).
 * - Fight phase: a budget of useful activity minutes (48h x endurance); when it runs out the
 *   character heals for real time (24h / social), then fights again with a full budget.
 * - Points: 1 per scored minute x force, doubled on a critical hit (agility); the minutes scored
 *   by an activity are its intersection with the fight phases, capped by the budget.
 * - Stats: x1 at 0, x25 at STAT_POINTS_PER_UNIT x 25; frozen per season by the server.
 */

import type { StatsXP } from '@/Class/Experience';
import type {
    RaidActivity,
    RaidCurrentPhase,
    RaidDifficulty,
    RaidHit,
    RaidPhase,
    RaidPhaseKind,
    RaidSimulation,
    RaidSkipInput
} from '@/Data/User/Raids';

export const RAID_MIN_LEVEL = 10;
export const STAT_MULT_MAX = 25;
/** Stat points for one multiplier unit: x25 at 10 000 points (a useful activity brings 1 point per stat, 7 in total) */
export const STAT_POINTS_PER_UNIT = 400;
export const BASE_BUDGET_MINUTES = 48 * 60;
export const BASE_HEAL_SECONDS = 24 * 60 * 60;
/** Critical chance per multiplier unit: 0% at 0, 50% at the cap */
export const CRIT_PER_MULT = 0.02;
/** Bonus drop chance per multiplier unit: 0% at 0, 100% at the cap */
export const DROP_PER_MULT = 0.04;
export const HEAL_OX_PER_MINUTE = 2;
export const HP_PER_PARTICIPANT: Readonly<Record<RaidDifficulty, number>> = { easy: 1500, normal: 2500, hard: 4000 };
export const DIFFICULTY_WEIGHTS: readonly (readonly [RaidDifficulty, number])[] = [
    ['easy', 0.5],
    ['normal', 0.35],
    ['hard', 0.15]
];
/** Experience.getXPDict, type 'user' */
export const USER_XP_PER_LEVEL = 20;
export const USER_XP_RATIO = 0.5;
/** Experience.GetExperienceFriendBonus: +2% per friend, +20% at most */
export const FRIEND_XP_BONUS_PER_FRIEND = 0.02;
export const FRIEND_XP_BONUS_MAX = 0.2;
/** Rank thresholds announced in the feed */
export const RANK_THRESHOLDS: readonly (1 | 3 | 10)[] = [1, 3, 10];

export const STATS_KEYS: readonly (keyof StatsXP)[] = ['int', 'for', 'dex', 'sta', 'agi', 'soc'];

/** Stats from an untrusted source: finite, >= 0, every key present */
export function NormalizeStats(input: unknown): StatsXP {
    const stats: StatsXP = { int: 0, for: 0, dex: 0, sta: 0, agi: 0, soc: 0 };
    if (typeof input !== 'object' || input === null) {
        return stats;
    }
    const raw = input as Record<string, unknown>;
    for (const key of STATS_KEYS) {
        const value = raw[key];
        if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
            stats[key] = value;
        }
    }
    return stats;
}

/** x0 at 0 stat point, x25 at STAT_POINTS_PER_UNIT x 25 */
export function StatMult(stat: number): number {
    if (!Number.isFinite(stat)) {
        return 0;
    }
    return Math.min(STAT_MULT_MAX, Math.max(0, stat / STAT_POINTS_PER_UNIT));
}

/** Force: never below 1 point per minute */
export function PointsPerMinute(stats: StatsXP): number {
    return Math.max(1, StatMult(stats.for));
}

/** Endurance: minutes of useful activity per fight phase, [48h; 192h], rounded */
export function BudgetMinutes(stats: StatsXP): number {
    return Math.round(BASE_BUDGET_MINUTES * (1 + (3 * StatMult(stats.sta)) / STAT_MULT_MAX));
}

/** Social: seconds of a heal phase, [24h; 6h], rounded */
export function HealSeconds(stats: StatsXP): number {
    return Math.round(BASE_HEAL_SECONDS / (1 + (3 * StatMult(stats.soc)) / STAT_MULT_MAX));
}

/** Agility: [0; 0.5] */
export function CritChance(stats: StatsXP): number {
    return CRIT_PER_MULT * StatMult(stats.agi);
}

/** Intelligence: chance of a bonus copy of every item/chest reward of the season, [0; 1] */
export function DropBonus(stats: StatsXP): number {
    return DROP_PER_MULT * StatMult(stats.int);
}

/** FNV-1a 32 bits over the little-endian bytes of each value; `Math.imul` keeps it identical in JS */
export function Fnv1a32(values: number[]): number {
    let h = 0x811c9dc5;
    for (const value of values) {
        const u = value >>> 0;
        for (let i = 0; i < 4; i++) {
            h ^= (u >>> (8 * i)) & 0xff;
            h = Math.imul(h, 0x01000193);
        }
    }
    return h >>> 0;
}

/**
 * Deterministic critical draw: the seed is per (participant, season) and never leaves the server,
 * the activity ID is assigned by the database at the insertion. A replay gives the same answer.
 */
export function IsCritical(seed: number, activityID: number, chance: number): boolean {
    return chance > 0 && Fnv1a32([seed, activityID]) / 4294967296 < chance;
}

/** Port of Experience.getXPDict (user): 0 for a negative total, 1 at 0 XP, 10 at 900 XP */
export function LevelFromXP(totalXP: number): number {
    if (!Number.isFinite(totalXP) || totalXP < 0) {
        return 0;
    }
    return Math.floor((1 + Math.pow(1 + (8 * totalXP) / USER_XP_PER_LEVEL, USER_XP_RATIO)) / 2);
}

export function HPPerParticipant(difficulty: RaidDifficulty): number {
    return HP_PER_PARTICIPANT[difficulty];
}

/** @param random [0; 1[ */
export function DrawDifficulty(random: number): RaidDifficulty {
    let cumulative = 0;
    for (const [difficulty, weight] of DIFFICULTY_WEIGHTS) {
        cumulative += weight;
        if (random < cumulative) {
            return difficulty;
        }
    }
    return 'hard';
}

/** UTC month containing `now`: [1st 00:00 ; 1st of the next month 00:00[ (Date.UTC carries December over) */
export function SeasonBounds(now: number): { start: number; end: number } {
    const date = new Date(now * 1000);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    return { start: Date.UTC(year, month, 1) / 1000, end: Date.UTC(year, month + 1, 1) / 1000 };
}

/**
 * Scoring window of the season containing `now`: it always starts on the 1st of the month, and ends
 * `restSeconds` before the 1st of the next month, so that a boss which was not defeated leaves the
 * players a rest before the next raid.
 */
export function SeasonWindow(now: number, restSeconds: number): { start: number; end: number } {
    const bounds = SeasonBounds(now);
    return { start: bounds.start, end: bounds.end - Math.max(0, restSeconds) };
}

/** Life of the boss: the floor keeps a handful of early players from killing it before the crowd arrives */
export function MaxHP(hpPerParticipant: number, scoringCount: number, minParticipants: number): number {
    return hpPerParticipant * Math.max(1, scoringCount, minParticipants);
}

/**
 * Change of the participant's share of the season progress when its damage moves from `damage`
 * to `newDamage`. A credit is valued at the current boss life; a debit gives back the same
 * proportion of what was credited, so the registry stays summable whatever the participant flows.
 */
export function ContribDelta(contrib: number, damage: number, newDamage: number, maxHP: number): number {
    const delta = newDamage - damage;
    if (delta >= 0) {
        return maxHP > 0 ? delta / maxHP : 0;
    }
    if (damage <= 0 || contrib <= 0) {
        return 0;
    }
    return -Math.min(contrib, (contrib * -delta) / damage);
}

/** Seconds of heal left at `now`, 0 when fighting */
export function RemainingHeal(simulation: RaidSimulation, now: number): number {
    const { current } = simulation;
    return current.kind === 'heal' && current.end !== null ? Math.max(0, current.end - now) : 0;
}

/** Ad: half of the remaining heal, in minutes, rounded up */
export function HealAdMinutes(remainingSeconds: number): number {
    return Math.ceil(Math.ceil(remainingSeconds / 60) / 2);
}

/** Minutes billed for a full heal: at least one */
export function HealOxMinutes(remainingSeconds: number): number {
    return Math.max(1, Math.ceil(remainingSeconds / 60));
}

/** Ox: 2 per remaining minute */
export function HealOxPrice(remainingSeconds: number): number {
    return HEAL_OX_PER_MINUTE * HealOxMinutes(remainingSeconds);
}

export interface RaidSimulationInput {
    seasonStart: number;
    seasonEnd: number;
    defeatedAt: number | null;
    /** null: no critical at all (app preview, the seed never leaves the server) */
    seed: number | null;
    stats: StatsXP;
    /** Useful activities only (OxEconomy.UsefulActivities), any order */
    activities: RaidActivity[];
    /** Skips not refunded, any order */
    skips: RaidSkipInput[];
    /** Frozen once per request */
    now: number;
}

/**
 * Replay of one participant from the start of the season: phases, hits, totals and the phase at
 * `now`. Pure: nothing is written. The fold is independent of the input order.
 */
export function SimulateParticipant(input: RaidSimulationInput): RaidSimulation {
    const from = input.seasonStart;
    const scoringEnd = Math.min(input.defeatedAt ?? input.seasonEnd, input.seasonEnd);
    const budgetTotal = BudgetMinutes(input.stats);
    const budgetTotalSec = budgetTotal * 60;
    const ppm = PointsPerMinute(input.stats);
    const healSeconds = HealSeconds(input.stats);
    const chance = CritChance(input.stats);

    const idOf = (id: number | null): number => (id === null ? Number.MAX_SAFE_INTEGER : id);
    // Strict intersection with [from, scoringEnd]: an activity straddling either boundary scores its
    // useful part and nothing more. Filtering on `startTime` alone would drop an activity overlapping
    // the season start entirely, and count in full one started a minute before the boss went down.
    const activities = input.activities
        .filter((a) => a.duration > 0 && a.startTime < scoringEnd && a.startTime + a.duration * 60 > from)
        .sort((a, b) => a.startTime - b.startTime || idOf(a.id) - idOf(b.id));
    const skips = [...input.skips].sort((a, b) => a.time - b.time || a.id - b.id);

    const phases: RaidPhase[] = [];
    const hits: RaidHit[] = [];
    const unusedSkipIDs: number[] = [];
    let kind: RaidPhaseKind = 'fight';
    let phaseStart = from;
    let healEnd = 0;
    let budgetSec = budgetTotalSec;
    let skipIndex = 0;

    /** Consume the skips dated up to `until`: those inside the running heal shorten it, the others are lost */
    const applySkips = (until: number): void => {
        while (skipIndex < skips.length && skips[skipIndex].time <= until) {
            const skip = skips[skipIndex++];
            if (kind === 'heal' && skip.time >= phaseStart && skip.time < healEnd) {
                healEnd = Math.max(skip.time, healEnd - skip.minutes * 60);
            } else {
                unusedSkipIDs.push(skip.id);
            }
        }
    };

    /** Heal over at `time`: close it and open a fight with a full budget */
    const endHealIfOver = (time: number): void => {
        if (kind === 'heal' && healEnd <= time) {
            phases.push({ kind: 'heal', start: phaseStart, end: healEnd });
            kind = 'fight';
            phaseStart = healEnd;
            budgetSec = budgetTotalSec;
        }
    };

    for (const activity of activities) {
        const activityEnd = Math.min(activity.startTime + activity.duration * 60, scoringEnd);
        let cursor = Math.max(activity.startTime, from);
        let scoredSec = 0;

        // The activity is consumed from phase to phase: fight minutes score (up to the budget),
        // heal minutes are skipped, and the part after the heal scores again
        while (cursor < activityEnd) {
            if (kind === 'heal') {
                // Every skip inside the heal is known before the heal is jumped over
                applySkips(healEnd);
                endHealIfOver(cursor);
                if (kind === 'heal') {
                    if (healEnd >= activityEnd) {
                        break;
                    }
                    cursor = healEnd;
                    continue;
                }
            }
            applySkips(cursor);

            const take = Math.min(activityEnd - cursor, budgetSec);
            scoredSec += take;
            budgetSec -= take;
            cursor += take;

            if (budgetSec <= 0) {
                // The heal starts where the useful part ends, not at the end of the activity
                phases.push({ kind: 'fight', start: phaseStart, end: cursor });
                kind = 'heal';
                phaseStart = cursor;
                healEnd = cursor + healSeconds;
            }
        }

        if (scoredSec > 0) {
            const minutes = Math.round(scoredSec / 60);
            const critical = input.seed !== null && activity.id !== null && IsCritical(input.seed, activity.id, chance);
            hits.push({
                activityID: activity.id,
                startTime: activity.startTime,
                skillID: activity.skillID,
                minutes,
                points: Math.round((scoredSec / 60) * ppm * (critical ? 2 : 1)),
                critical
            });
        }
    }

    // State at `now`: skips after the last activity, heal possibly over
    if (kind === 'heal') {
        applySkips(healEnd);
        endHealIfOver(input.now);
    }
    applySkips(input.now);
    phases.push(kind === 'heal' ? { kind, start: phaseStart, end: healEnd } : { kind, start: phaseStart, end: null });

    const current: RaidCurrentPhase =
        kind === 'heal'
            ? { kind, start: phaseStart, end: healEnd, budgetTotal, budgetUsed: budgetTotal }
            : {
                  kind,
                  start: phaseStart,
                  end: null,
                  budgetTotal,
                  budgetUsed: Math.round((budgetTotalSec - budgetSec) / 60)
              };

    let damage = 0;
    let criticals = 0;
    let minutes = 0;
    for (const hit of hits) {
        damage += hit.points;
        minutes += hit.minutes;
        if (hit.critical) {
            criticals++;
        }
    }

    return { phases, hits, totals: { damage, hits: hits.length, criticals, minutes }, current, unusedSkipIDs };
}

export interface ProgressActivity {
    skillID: number;
    /** Minutes */
    duration: number;
    friendsCount: number;
}

export interface ProgressSkill {
    XP: number;
    Stats: StatsXP;
}

/**
 * Total XP and stats of an account from its useful activities, port of
 * Experience.CalculateTotalXP (skill XP per hour with the friends bonus; 1 stat point per
 * activity and per stat, whatever its duration).
 */
export function ComputeAccountProgress(
    activities: ProgressActivity[],
    skillByID: (skillID: number) => ProgressSkill | null
): { xp: number; stats: StatsXP } {
    let xp = 0;
    const stats: StatsXP = { int: 0, for: 0, dex: 0, sta: 0, agi: 0, soc: 0 };
    for (const activity of activities) {
        const skill = skillByID(activity.skillID);
        if (skill === null) {
            continue;
        }
        const bonus = Math.min(FRIEND_XP_BONUS_MAX, Math.max(0, activity.friendsCount) * FRIEND_XP_BONUS_PER_FRIEND);
        xp += skill.XP * (activity.duration / 60) * (1 + bonus);
        for (const key of STATS_KEYS) {
            stats[key] += skill.Stats[key];
        }
    }
    return { xp, stats };
}
