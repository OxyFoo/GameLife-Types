/**
 * Pure rules of the item stats — no I/O, deterministic.
 *
 * Shipped by the shared package on purpose: the server rolls the stats of every new copy of an item
 * and re-rolls them at the forge, the app shows them and previews the bonus of the equipped copies.
 * Both import this very module, so there is nothing left to keep in sync.
 *
 * Rules (product owner, 2026-10-03):
 * - A copy of an item (an inventory row) carries its own stats: a percent bonus per stat, rolled once
 *   when the copy is created, re-rolled with the same shape when the forge raises its rarity.
 * - "X points to split among the stats Y": X is a total percent drawn in a range [min; max] (one range
 *   per rarity in the database, an item may carry its own), Y is the largest list of stats the copy may
 *   carry (every stat by default). The copy gets 1 to |Y| stats and the total is split among them.
 * - The equipped copies multiply the stats of the player: stat × (1 + Σ percent / 100).
 */

import type { StatsXP } from '@/Class/Experience';
import type { Item, ItemStatsMap, ItemStatsRange, StatKey } from '@/Data/App/Items';
import type { ItemStatRange } from '@/Data/App/ItemStatRanges';
import type { Rarities } from '@/Global/Rarities';

/** Canonical order of the stats; part of the determinism of a roll (same keys as RaidEngine) */
export const STAT_KEYS: readonly StatKey[] = ['int', 'for', 'dex', 'sta', 'agi', 'soc'];

/** Stats of a copy from an untrusted source (database JSON, client): known keys only, integers >= 1 */
export function NormalizeItemStats(input: unknown): ItemStatsMap {
    const stats: ItemStatsMap = {};
    if (typeof input !== 'object' || input === null || Array.isArray(input)) {
        return stats;
    }
    const raw = input as Record<string, unknown>;
    for (const key of STAT_KEYS) {
        const value = raw[key];
        if (typeof value === 'number' && Number.isFinite(value) && Math.floor(value) >= 1) {
            stats[key] = Math.floor(value);
        }
    }
    return stats;
}

/** Total percent of a copy */
export function SumItemStats(stats: ItemStatsMap): number {
    let total = 0;
    for (const key of STAT_KEYS) {
        total += stats[key] ?? 0;
    }
    return total;
}

/** Inclusive integer bounds, never negative, swapped when inverted */
function NormalizeRange(range: ItemStatsRange): ItemStatsRange {
    const clean = (value: number) => (Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0);
    const min = clean(range.min);
    const max = clean(range.max);
    return min <= max ? { min, max } : { min: max, max: min };
}

/** The stats a copy may carry, in `STAT_KEYS` order, without duplicate nor unknown key; null = every stat */
function AllowedKeys(keys: readonly StatKey[] | null): StatKey[] {
    if (keys === null) {
        return [...STAT_KEYS];
    }
    return STAT_KEYS.filter((key) => keys.includes(key));
}

/** Uniform integer in [min; max] from one draw in [0, 1); always one draw, so a roll has a fixed length */
function UniformInt(random: () => number, min: number, max: number): number {
    const draw = random();
    if (max <= min) {
        return min;
    }
    return min + Math.floor(draw * (max - min + 1));
}

/**
 * Range of the total percent for a copy of `item` at `rarity`: the item's own range at its
 * definition rarity, the row of the rarity otherwise. Assumption (owner, 2026-10-03): the override
 * holds only at the item's own rarity, a copy the forge raised follows the table. Null when the
 * table has no row for the rarity.
 */
export function RangeForRarity(
    item: Pick<Item, 'Rarity' | 'StatsRange'>,
    rarity: Rarities,
    ranges: readonly ItemStatRange[]
): ItemStatsRange | null {
    if (rarity === item.Rarity && item.StatsRange !== null) {
        return item.StatsRange;
    }
    const row = ranges.find((range) => range.Rarity === rarity);
    return row === undefined ? null : { min: row.Min, max: row.Max };
}

/**
 * Rolls the stats of one new copy. Pure: the same `random` sequence gives the same map.
 * 1. The total X is uniform in [min; max].
 * 2. The number of stats n is uniform in [1; |Y|], Y = `keys` among `STAT_KEYS` (null = every stat).
 * 3. Y is shuffled (Fisher–Yates, |Y| − 1 draws whatever n): the first n stats are the ones carried.
 * 4. Each of them in turn draws its share from what remains, the last one takes the remainder. When
 *    X >= n every stat gets at least 1 (the share is drawn in [1; remaining − stats left]); otherwise
 *    some shares are 0 and those stats are left out of the map.
 * The owner's example, X = 20 and two stats: the first draws 12, the second takes the remaining 8.
 * @param random Uniform in [0, 1): `Mulberry32(seed)`, or any sequence in a test
 */
export function RollItemStats(
    range: ItemStatsRange,
    keys: readonly StatKey[] | null,
    random: () => number
): ItemStatsMap {
    const pool = AllowedKeys(keys);
    if (pool.length === 0) {
        return {};
    }

    const { min, max } = NormalizeRange(range);
    const total = UniformInt(random, min, max);
    const count = UniformInt(random, 1, pool.length);

    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const picked = pool.slice(0, count);

    const stats: ItemStatsMap = {};
    let remaining = total;
    for (let i = 0; i < picked.length; i++) {
        const left = picked.length - i - 1;
        let share: number;
        if (left === 0) {
            share = remaining;
        } else if (remaining >= left + 1) {
            share = UniformInt(random, 1, remaining - left);
        } else {
            share = UniformInt(random, 0, remaining);
        }
        remaining -= share;
        if (share > 0) {
            stats[picked[i]] = share;
        }
    }
    return stats;
}

/**
 * Re-rolls the stats of a copy that changes rarity: the SAME stats with the SAME proportions, for a
 * new total drawn in `range`. The shares are rounded by largest remainder (their sum is exactly the
 * total) and, when the total allows it, no stat falls to 0: a 0 share is lifted to 1, taken from the
 * largest ones. A copy without stats (never rolled) gets a fresh roll over every stat instead.
 */
export function RerollItemStatsPreservingShape(
    stats: ItemStatsMap,
    range: ItemStatsRange,
    random: () => number
): ItemStatsMap {
    const current = NormalizeItemStats(stats);
    const keys = STAT_KEYS.filter((key) => (current[key] ?? 0) > 0);
    const oldTotal = SumItemStats(current);
    if (keys.length === 0 || oldTotal <= 0) {
        return RollItemStats(range, null, random);
    }

    const { min, max } = NormalizeRange(range);
    const total = UniformInt(random, min, max);
    if (total === 0) {
        return {};
    }

    // Largest remainder: floors first, then one more to the largest fractions until the sum is reached
    const exact = keys.map((key) => (total * (current[key] ?? 0)) / oldTotal);
    const shares = exact.map((value) => Math.floor(value));
    let missing = total - shares.reduce((sum, share) => sum + share, 0);
    const byRemainder = keys
        .map((_, index) => index)
        .sort((a, b) => exact[b] - shares[b] - (exact[a] - shares[a]) || a - b);
    for (const index of byRemainder) {
        if (missing <= 0) {
            break;
        }
        shares[index] += 1;
        missing -= 1;
    }

    // No stat disappears when the total allows one point each
    if (total >= keys.length) {
        let deficit = 0;
        for (let index = 0; index < shares.length; index++) {
            if (shares[index] === 0) {
                shares[index] = 1;
                deficit += 1;
            }
        }
        while (deficit > 0) {
            let largest = -1;
            for (let index = 0; index < shares.length; index++) {
                if (shares[index] >= 2 && (largest === -1 || shares[index] > shares[largest])) {
                    largest = index;
                }
            }
            shares[largest] -= 1;
            deficit -= 1;
        }
    }

    const result: ItemStatsMap = {};
    keys.forEach((key, index) => {
        if (shares[index] > 0) {
            result[key] = shares[index];
        }
    });
    return result;
}

/** Percent bonus per stat over the equipped copies (their percents add up), every key present */
export function EquipmentBonusPercent(equipped: readonly ItemStatsMap[]): Record<StatKey, number> {
    const bonus: Record<StatKey, number> = { int: 0, for: 0, dex: 0, sta: 0, agi: 0, soc: 0 };
    for (const stats of equipped) {
        const clean = NormalizeItemStats(stats);
        for (const key of STAT_KEYS) {
            bonus[key] += clean[key] ?? 0;
        }
    }
    return bonus;
}

/**
 * Stats of the player with the equipped copies: base × (1 + Σ percent / 100), rounded to the point.
 * A non-finite or negative base counts 0. The app shows the result, the server applies it to the
 * raids, the friends and the forge.
 */
export function ApplyEquipmentBonus(stats: StatsXP, equipped: readonly ItemStatsMap[]): StatsXP {
    const bonus = EquipmentBonusPercent(equipped);
    const result: StatsXP = { int: 0, for: 0, dex: 0, sta: 0, agi: 0, soc: 0 };
    for (const key of STAT_KEYS) {
        const base = Number.isFinite(stats[key]) && stats[key] > 0 ? stats[key] : 0;
        result[key] = Math.round(base * (1 + bonus[key] / 100));
    }
    return result;
}
