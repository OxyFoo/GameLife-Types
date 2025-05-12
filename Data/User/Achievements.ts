export interface AchievementItem {
    AchievementID: number;
    State: 'OK' | 'PENDING';
    /** @type Unix UTC timestamp in seconds */
    Date: number;
}

export type SaveObject_Achievements = {
    solved: AchievementItem[];
    unsaved: AchievementItem[];
    token: number;
};
