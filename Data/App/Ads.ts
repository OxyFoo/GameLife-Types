import { OSKeys } from '@/Global/OS';

export type AdNames = 'shop';

export type AdType = 'rewarded' | 'interstitial';

export interface Ad {
    Name: AdNames;
    Codes: Record<OSKeys, string>;
    Type: AdType;
    RewardOx: number;
}
