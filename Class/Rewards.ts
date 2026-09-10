import { Rarities } from '@/Global/Rarities';
import { Stuff } from '@/Data/User/Inventory';
import { ItemID, ItemSlot } from '@/Data/App/Items';

export type ChestRarity = Exclude<Rarities, 'legendary'>;

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
    ChestRarity: ChestRarity;
    /** Restrict the drawn item to one slot (targeted chest) */
    Slot?: ItemSlot;
}
interface ChestReward {
    Type: 'Chest';
    ChestRarity: ChestRarity;
    Stuff: Stuff;
}

interface AchievementRawReward {
    Type: 'Achievement';
    AchievementID: number;
}
interface AchievementReward {
    Type: 'Achievement';
    AchievementID: number;
    /** Already in the inventory: nothing was added */
    AlreadyOwned: boolean;
}

export type RawReward = TitleRawReward | OXRawReward | ItemRawReward | ChestRawReward | AchievementRawReward;

export type Reward = TitleReward | OXReward | ItemReward | ChestReward | AchievementReward;

export type RewardType = Reward['Type'];
