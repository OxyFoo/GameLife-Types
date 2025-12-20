import { ItemID, CharactersID } from '@/Data/App/Items';

export interface Stuff {
    ID: number;
    ItemID: ItemID;
    CreatedBy: number;
    CreatedAt: number;
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
