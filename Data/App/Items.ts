import { Rarities } from '@/Global/Rarities';
import { LangType } from '@/Global/Langs';

export type CharactersID = 'human_00' | 'human_01';

export type ItemID =
    | 'hair_00'
    | 'top_00'
    | 'bottom_00'
    | 'shoes_00'
    | 'hair_01'
    | 'top_01'
    | 'bottom_01'
    | 'shoes_01'
    | 'hair_02'
    | 'top_02'
    | 'bottom_02'
    | 'shoes_02';

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
