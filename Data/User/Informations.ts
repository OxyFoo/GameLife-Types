export type SaveObject_UserInformations = {
    username: string;
    usernameTime: number | null;
    titleID: number;
    UNSAVED_title: number | null;
    birthTime: number | null;
    lastBirthTime: number | null;
    UNSAVED_birthTime: number | null;
    xp: number;
    ox: number;
    /** Expiry (unix seconds) of the used weekly base-price slot for activity deletions/editions, null if available */
    oxFreeSlotUntil: number | null;
    adRemaining: number;
    /** Activity ox boosts left today: own daily quota, not the `adRemaining` one */
    activityBonusRemaining: number;
    adTotalWatched: number;
    achievementSelfFriend: boolean;
    purchasedCount: number;
};
