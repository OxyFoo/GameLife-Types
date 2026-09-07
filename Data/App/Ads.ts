import { OSKeys } from '@/Global/OS';

export type AdNames = 'shop' | 'activity-bonus';

export type AdType = 'rewarded' | 'interstitial';

export interface Ad {
    Name: AdNames;
    Codes: Record<OSKeys, string>;
    Type: AdType;
    /** Flat ox reward, null when the amount is computed server-side (see `activity-bonus`) */
    RewardOx: number | null;
    /** Daily quota of this ad, counted on the server day */
    MaxPerDay: number;
}
