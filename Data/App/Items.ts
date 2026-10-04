import type { Rarities } from '@/Global/Rarities';
import type { LangType } from '@/Global/Langs';
import type { StatsXP } from '@/Class/Experience';
import type { ItemName } from '@oxyfoo/avatar-factory';

export type CharactersID = 'human_00' | 'human_01';

export type ItemID = ItemName;

export type ItemSlot = 'hair' | 'top' | 'bottom' | 'shoes';

export type ItemBuffs = [];

export type StatKey = keyof StatsXP;

/** Percent bonus per stat of one owned copy; an absent key is 0, a value is an integer >= 1 */
export type ItemStatsMap = Partial<Record<StatKey, number>>;

/** Total percent to split among the stats of a new copy, inclusive integer bounds */
export interface ItemStatsRange {
    min: number;
    max: number;
}

export interface Item {
    ID: ItemID;
    Slot: ItemSlot;
    Name: LangType;
    Description: LangType;
    Rarity: Rarities;
    Buyable: boolean;
    Value: number;
    Buffs: ItemBuffs;
    /** Own range of the item, at its definition rarity only; null = the range of its rarity */
    StatsRange: ItemStatsRange | null;
    /** Largest list of stats a copy may carry; null = every stat */
    StatsKeys: StatKey[] | null;
}
