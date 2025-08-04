import { LangType } from '@/Global/Langs';
import { RawReward } from '@/Class/Rewards';

export type AchievementType = 'AUTO' | 'SHOW' | 'HIDE';

export type Comparator =
    | 'Battery'
    | 'Level'
    | 'Sk'
    | 'SkT'
    | 'St'
    | 'HCa'
    | 'Ca'
    | 'ItemCount'
    | 'Ad'
    | 'Title'
    | 'SelfFriend'
    | 'AccountAge';

export type Operator = 'None' | 'LT' | 'GT';

export interface Achievement {
    ID: number;

    /**
     * @description
     * - SHOW: always visible
     * - AUTO: show condition and reward only when solved
     * - HIDE: not shown if unsolved, all visible if solved
     */
    Type: AchievementType;

    Name: LangType;

    Description: LangType;

    Condition: Condition | null;

    Rewards: RawReward[];

    /** @description Global players percentage [0-100] */
    UniversalProgressPercentage: number;
}

export interface Condition {
    Comparator: {
        Type: Comparator;
        Value: number | null;
    };
    Operator: Operator;
    Value: string | number | null;
}
