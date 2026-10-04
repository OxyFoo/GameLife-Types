import type { Rarities } from '@/Global/Rarities';

/**
 * Total percent of stats a new copy of an item of this rarity rolls, inclusive bounds
 * (table `ItemStatRanges`, one row per rarity). An item may override it with its own range.
 */
export interface ItemStatRange {
    Rarity: Rarities;
    Min: number;
    Max: number;
}
