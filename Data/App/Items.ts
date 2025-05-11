import { Rarities } from '@/Global/Rarities';
import { LangType } from '@/Global/Langs';

export type ItemID = 'hair_01' | 'top_01' | 'bottom_01' | 'shoes_01'; // TODO: Add all (from resources ?)

export type ItemSlot = 'hair' | 'top' | 'bottom' | 'shoes';

export type ItemBuffs = [];

export interface Item {
    ID: ItemID;
    Slot: ItemSlot;
    Name: LangType;
    Description: LangType;
    Rarity: Rarities;
    Buyable: boolean;
    Value: number;
    Buffs: ItemBuffs;
}
