/**
 * Pure rules of the item economy — no I/O, deterministic.
 *
 * Shipped by the shared package on purpose: the app previews a price, the server applies it, and the
 * two must agree to the ox. Both import this very module, so there is nothing left to keep in sync.
 *
 * Rules (product owner, 2026-09-13):
 * - An item is worth the random chest of its rarity (`Items.Value` in the database): common 222,
 *   rare 666, epic 2 000, legendary 6 000. Every item of a rarity has the same value, for now.
 * - Selling gives back half of the value, rounded up.
 * - The daily deals are 3 slots. Each slot rolls its rarity (80% common, 18% rare, 2% epic; a 0%
 *   weight never comes out, so never legendary) then one buyable item of that rarity, from the date
 *   only: every player sees the same deals and the displayed price is the one charged.
 * - A daily deal is sold at a fixed price by rarity: common 180, rare 555, epic 1 800.
 */

import type { Item } from '@/Data/App/Items';
import type { Rarities } from '@/Global/Rarities';
import { ALL_RARITIES } from '@/Global/Rarities';

/** Player gets half of the item value when selling */
export const SELL_PRICE_FACTOR = 0.5;

/** Ox given back for one item, from its value */
export function SellPriceOf(value: number): number {
    return Math.ceil(value * SELL_PRICE_FACTOR);
}

export const DAILY_DEAL_COUNT = 3;

/** Chance of each rarity for one daily deal slot, in percent. A weight of 0 never comes out. */
export const DAILY_DEAL_RARITY_WEIGHTS: Record<Rarities, number> = {
    common: 80,
    rare: 18,
    epic: 2,
    legendary: 0
};

/** Price of a daily deal by rarity. No price for a rarity that never comes out. */
export const DAILY_DEAL_PRICES: Partial<Record<Rarities, number>> = {
    common: 180,
    rare: 555,
    epic: 1800
};

/** Price of a daily deal for an item of that rarity, null when the rarity is not sold as a deal */
export function DailyDealPriceOf(rarity: Rarities): number | null {
    return DAILY_DEAL_PRICES[rarity] ?? null;
}

/**
 * Rarity of one daily deal slot from a uniform roll in [0, 1): the weights are cumulated in
 * `ALL_RARITIES` order (common, rare, epic, legendary), a 0 weight is never reached.
 */
export function DailyDealRarityFor(roll: number): Rarities {
    const sold = ALL_RARITIES.filter((rarity) => DAILY_DEAL_RARITY_WEIGHTS[rarity] > 0);
    const total = sold.reduce((sum, rarity) => sum + DAILY_DEAL_RARITY_WEIGHTS[rarity], 0);
    let cumulative = 0;
    for (const rarity of sold) {
        cumulative += DAILY_DEAL_RARITY_WEIGHTS[rarity];
        if (roll < cumulative / total) {
            return rarity;
        }
    }
    return sold[sold.length - 1];
}

/**
 * Rarities to try for a slot rolled at `rarity`, in order: the rolled one, then each one below
 * (`ALL_RARITIES` order), never above.
 */
export function DailyDealRarityFallbacks(rarity: Rarities): Rarities[] {
    return ALL_RARITIES.slice(0, ALL_RARITIES.indexOf(rarity) + 1).reverse();
}

export type DailyDealCandidate = Pick<Item, 'ID' | 'Rarity' | 'Buyable'>;

/**
 * The daily deals for a seed: `DAILY_DEAL_COUNT` slots, each rolling its rarity then one buyable
 * item of that rarity, without duplicate. A slot whose rarity has no item left falls back to the
 * rarities below (`DailyDealRarityFallbacks`) and is skipped when none has any.
 * Pure: the same seed and items give the same deals, whatever the order of `items`.
 */
export function PickDailyDeals<T extends DailyDealCandidate>(items: T[], seed: number): T[] {
    const pool = items.filter((item) => item.Buyable).sort((a, b) => (a.ID < b.ID ? -1 : a.ID > b.ID ? 1 : 0));
    const random = Mulberry32(seed);

    const deals: T[] = [];
    for (let slot = 0; slot < DAILY_DEAL_COUNT; slot++) {
        // Two draws per slot whatever happens, so a slot never shifts the draws of the next ones
        const rolled = DailyDealRarityFor(random());
        const pick = random();

        for (const rarity of DailyDealRarityFallbacks(rolled)) {
            const candidates = pool.filter((item) => item.Rarity === rarity && !deals.includes(item));
            if (candidates.length > 0) {
                deals.push(candidates[Math.floor(pick * candidates.length)]);
                break;
            }
        }
    }
    return deals;
}

/** Small seeded PRNG (mulberry32): uniform in [0, 1), the same sequence for the same seed everywhere */
function Mulberry32(seed: number): () => number {
    let state = seed >>> 0;
    return () => {
        state = (state + 0x6d2b79f5) >>> 0;
        let t = state;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
