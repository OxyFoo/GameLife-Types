import { ItemID } from '@/Data/App/Items';

export interface Stuff {
    ID: number;
    ItemID: ItemID;
    CreatedBy: number;
    CreatedAt: number;
}

export interface AvatarObject {
    // TODO: Link property
    sexe: 'MALE' | 'FEMALE';

    // TODO: Link property
    skin: 'skin_01';

    skinColor: number;

    hair: number;
    top: number;
    bottom: number;
    shoes: number;
}

export type SaveObject_Inventory = {
    titleIDs: number[],
    stuffs: Stuff[],
    avatar: AvatarObject,
    token: number
};
