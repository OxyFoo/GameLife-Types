export type FrequencyRepeatModes = 'week' | 'month';

export interface ScheduleRepeat {
    type: 'week' | 'month';
    repeat: number[];
    duration: number;
}

export interface ScheduleFrequency {
    type: 'frequency';
    frequencyMode: FrequencyRepeatModes;
    quantity: number;
    duration: number;
}

export interface Quest {
    /** @description Quest title with max 128 characters */
    title: string;

    /** @description Quest description with max 2048 characters */
    comment: string;

    /** @description Timestamp in seconds */
    created: number;

    /** @description Schedule */
    schedule: ScheduleRepeat | ScheduleFrequency;

    /** @description Skills ids */
    skills: number[];

    /** @description Maximum consecutive days */
    maximumStreak: number;
}

export interface QuestSaved extends Quest {
    ID: number;
}

export type SaveObject_Quests = {
    quests: QuestSaved[],
    unsavedAdditions: Quest[],
    unsavedEditions: QuestSaved[],
    unsavedDeletions: number[],
    sort: number[],
    sortIsSaved: boolean,
    token: number
};
