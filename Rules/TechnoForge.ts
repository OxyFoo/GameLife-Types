/**
 * Pure rules of the Techno-Forge — no I/O, deterministic.
 *
 * Shipped by the shared package on purpose: the app previews the chance and the cost of an attempt,
 * the server rolls it and applies it. Both import this very module.
 *
 * Rules (product owner, 2026-10-03):
 * - An attempt takes a main copy and 1 or 2 catalysts (other copies of the player, not equipped).
 *   The catalysts are consumed whatever the outcome; the main copy is never lost.
 * - Base chance of success: 30% with one catalyst, 60% with two. The dexterity of the player (with
 *   the bonus of the equipped copies) adds up to 30%, linearly up to 25 000 points. Capped at 100%.
 * - Every attempt costs ox, by the current rarity of the main copy: 30 from common, 60 from rare,
 *   120 from epic. The epic → legendary step is priced but not open yet.
 * - On success the main copy gains one rarity and its stats are re-rolled with the same shape
 *   (`ItemStats.RerollItemStatsPreservingShape`).
 */

import type { Rarities } from '@/Global/Rarities';
import { ALL_RARITIES } from '@/Global/Rarities';

export const FORGE_CATALYSTS_MIN = 1;
export const FORGE_CATALYSTS_MAX = 2;

/** Base chance of success by number of catalysts, in percent */
export const FORGE_BASE_CHANCE: Readonly<Record<number, number>> = { 1: 30, 2: 60 };

/** Dexterity bonus, in percent: 0 at 0 point, FORGE_DEX_BONUS_MAX at FORGE_DEX_CAP points or more */
export const FORGE_DEX_BONUS_MAX = 30;
export const FORGE_DEX_CAP = 25000;

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
 * Chance of success as a fraction of 1, capped at 1; 0 for a number of catalysts out of [1; 2].
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
