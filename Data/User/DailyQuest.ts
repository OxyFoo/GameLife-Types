export interface DailyQuestData {
    start: string;
    daysCount: number;
    claimed: number[];
}

export interface DailyQuestToday {
    selectedCategory: number | null;
    progression: number;
}

export type SaveObject_DailyQuest = {
    SAVED_data: DailyQuestData[],
    UNSAVED_data: DailyQuestData[],
    token: number
};
