export type ActivityAddedType = 'normal' | 'start-now' | 'zap-gpt';

export interface Activity {
    /** Skill ID */
    skillID: number;

    /** Start time in seconds, unix timestamp (UTC) */
    startTime: number;

    /** Duration in minutes */
    duration: number;

    /** Optional comment */
    comment: string;

    /** Timezone offset in hours */
    timezone: number;

    /** Type of activity addition */
    addedType: ActivityAddedType;

    /** Time when activity was added (unix timestamp, UTC) */
    addedTime: number;

    /** IDs of friends who have participated in the activity */
    friends: number[];

    /** Notify before time in minutes, or null if not set */
    notifyBefore: number | null;
}

/** Same as Activity, but with ID */
export interface ActivitySaved extends Activity {
    ID: number;
}

export interface CurrentActivity {
    skillID: number;

    /** In seconds, unix timestamp UTC */
    startTime: number;

    /** In hours */
    timezone: number;

    /** Array of accountIDs of friends who are also doing this activity */
    friendsIDs: number[];
}

export type SaveObject_Activities = {
    activities: ActivitySaved[];
    editions: ActivitySaved[];
    additions: Activity[];
    deletions: number[];
    current: CurrentActivity | null;
    token: number;
};
