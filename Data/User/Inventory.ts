import { ItemID, CharactersID, ItemStatsMap } from '@/Data/App/Items';
import { Rarities } from '@/Global/Rarities';

export interface Stuff {
    ID: number;
    ItemID: ItemID;
    CreatedBy: number;
    CreatedAt: number;
    /** Rarity of this copy, raised by the forge; the server resolves it from the item when the copy has none */
    Rarity: Rarities;
    /** Percent bonus per stat of this copy, `{}` until rolled */
    Stats: ItemStatsMap;
}

export interface AvatarObject {
    skin: CharactersID;
    skinColor: number;
    hair: number;
    top: number;
    bottom: number;
    shoes: number;
}

export type SaveObject_Inventory = {
    titleIDs: number[];
    stuffs: Stuff[];
    token: number;
};

export type SaveObject_Avatar = {
    avatar: AvatarObject;
    avatarEdited: boolean;
    token: number;
};
