import { MissionKeys, MissionState } from '@/Data/App/Missions';

export const DEFAULT_MISSIONS: MissionKeys[] = ['mission1', 'mission2', 'mission3'];

export interface MissionItem {
    name: MissionKeys;
    state: MissionState;
}

export type SaveObject_Missions = {
    missions: MissionItem[],
    token: number
};
