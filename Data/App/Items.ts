import { Rarities } from '@/Global/Rarities';
import { LangType } from '@/Global/Langs';
import { ItemName } from '@oxyfoo/avatar-factory';

export type CharactersID = 'human_00' | 'human_01';

export type ItemID = ItemName;

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
