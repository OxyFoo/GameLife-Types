import { Rarities } from '@/Global/Rarities';
import { Stuff } from '@/Data/User/Inventory';
import { ItemID } from '@/Data/App/Items';

interface TitleRawReward {
    Type: 'Title';
    TitleID: number;
}
interface TitleReward {
    Type: 'Title';
    TitleID: number;
    ConvertedIntoOx: boolean;
}

interface OXRawReward {
    Type: 'OX';
    Amount: number;
}
interface OXReward {
    Type: 'OX';
    Amount: number;
}

interface ItemRawReward {
    Type: 'Item';
    ItemID: ItemID;
    Count: number;
}
interface ItemReward {
    Type: 'Item';
    Stuff: Stuff;
    Count: number;
}

interface ChestRawReward {
    Type: 'Chest';
    ChestRarity: Rarities;
}
interface ChestReward {
    Type: 'Chest';
    ChestRarity: Rarities;
    Stuff: Stuff;
}

export type RawReward = TitleRawReward | OXRawReward | ItemRawReward | ChestRawReward;

export type Reward = TitleReward | OXReward | ItemReward | ChestReward;

export type RewardType = Reward['Type'];
