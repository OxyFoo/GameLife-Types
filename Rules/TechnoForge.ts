/**
 * Pure rules of the Techno-Forge — no I/O, deterministic.
 *
 * Shipped by the shared package on purpose: the app previews the chance and the cost of an attempt,
 * the server rolls it and applies it. Both import this very module.
 *
 * Rules (product owner, 2026-10-03):
 * - An attempt takes a main copy and 0 to 2 catalysts (other copies of the player, not equipped;
 *   owner, 2026-10-16: the main copy alone is enough). The catalysts are consumed whatever the
 *   outcome; the main copy is never lost.
 * - A catalyst has the same rarity as the main copy (owner, 2026-10-07): raising a rare takes rares.
 * - A copy of a starter item (the outfit of a new account) is never a catalyst: it can be neither
 *   sold nor lost. It can be the main copy; it never carries stats (`ItemStats.RangeForRarity`).
 * - Base chance of success: 30% with the main copy alone, 60% with one catalyst, 90% with two
 *   (owner, 2026-10-16). The dexterity of the player (with the bonus of the equipped copies) adds up
 *   to 30%, linearly up to 10 000 points, the cap of every stat (owner, 2026-10-12: same as the
 *   raids). Capped at 100%.
 * - Every attempt costs ox, by the current rarity of the main copy: 30 from common, 60 from rare,
 *   120 from epic. The epic → legendary step is priced but not open yet.
 * - On success the main copy gains one rarity and its stats are re-rolled with the same shape
 *   (`ItemStats.RerollItemStatsPreservingShape`).
 */

import type { Rarities } from '@/Global/Rarities';
import { ALL_RARITIES } from '@/Global/Rarities';
import { STAT_MULT_MAX, STAT_POINTS_PER_UNIT } from '@/Rules/RaidEngine';

export const FORGE_CATALYSTS_MIN = 0;
export const FORGE_CATALYSTS_MAX = 2;

/** Base chance of success by number of catalysts, in percent: the main copy alone, then +30% each */
export const FORGE_BASE_CHANCE: Readonly<Record<number, number>> = { 0: 30, 1: 60, 2: 90 };

/** Dexterity bonus, in percent: 0 at 0 point, FORGE_DEX_BONUS_MAX at FORGE_DEX_CAP points or more */
export const FORGE_DEX_BONUS_MAX = 30;
/** Same cap as the raid stats (10 000 points): every stat stops counting at the same level */
export const FORGE_DEX_CAP = STAT_POINTS_PER_UNIT * STAT_MULT_MAX;

/** Ox of one attempt by the CURRENT rarity of the main copy; no price = nothing above */
export const FORGE_COSTS: Readonly<Partial<Record<Rarities, number>>> = { common: 30, rare: 60, epic: 120 };

/** Rarities a copy can be forged from today (the epic → legendary step is closed for now) */
export const FORGE_OPEN_FROM: readonly Rarities[] = ['common', 'rare'];

/** The rarity above, in `ALL_RARITIES` order; null at the top */
export function NextRarity(rarity: Rarities): Rarities | null {
    const index = ALL_RARITIES.indexOf(rarity);
    return index >= 0 && index < ALL_RARITIES.length - 1 ? ALL_RARITIES[index + 1] : null;
}

/** Ox of an attempt from this rarity, null when nothing is above */
export function ForgeCost(rarity: Rarities): number | null {
    return FORGE_COSTS[rarity] ?? null;
}

/** Whether a copy of this rarity can be forged today */
export function IsForgeOpen(rarity: Rarities): boolean {
    return FORGE_OPEN_FROM.includes(rarity) && NextRarity(rarity) !== null && ForgeCost(rarity) !== null;
}

/** Whether a copy of this rarity can serve as a catalyst for a main copy of `main` (same rarity) */
export function IsCatalystCompatible(main: Rarities, catalyst: Rarities): boolean {
    return main === catalyst;
}

/** Dexterity bonus in percent: linear up to the cap, 0 for a bad input */
function ForgeDexBonusPercent(dex: number): number {
    if (!Number.isFinite(dex) || dex <= 0) {
        return 0;
    }
    return Math.min(1, dex / FORGE_DEX_CAP) * FORGE_DEX_BONUS_MAX;
}

/** Dexterity bonus as a fraction of 1: linear up to the cap, 0 for a bad input */
export function ForgeDexBonus(dex: number): number {
    return ForgeDexBonusPercent(dex) / 100;
}

/**
 * Chance of success as a fraction of 1, capped at 1; 0 for a number of catalysts out of [0; 2].
 * The percents are added before the single division: 60% + 30% is exactly 0.9.
 */
export function ForgeChance(catalysts: number, dex: number): number {
    const base = FORGE_BASE_CHANCE[catalysts];
    if (base === undefined) {
        return 0;
    }
    return Math.min(100, base + ForgeDexBonusPercent(dex)) / 100;
}

/** Outcome of an attempt from one draw uniform in [0, 1) */
export function ForgeRoll(chance: number, random: number): boolean {
    return chance > 0 && random < chance;
}
