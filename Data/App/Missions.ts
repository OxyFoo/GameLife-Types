import { RawReward } from '@/Class/Rewards';

export type MissionKeys = 'mission1' | 'mission2' | 'mission3';

export type MissionState = 'pending' | 'completed' | 'claimed';

export type MissionType = {
    name: MissionKeys;
    rewards: RawReward[];
};
