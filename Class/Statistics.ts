export type PageStatistics = {
    pageName: string;
    visitCount: number;
    lastVisit: number;
};

export type LinkStatistics = {
    linkName: string;
    clickCount: number;
    lastClick: number;
};

export type SaveObject_Statistics = {
    pages: PageStatistics[];
    links: LinkStatistics[];
    loadingTimeMs: number;
    sessionsCount: number;
    lastSessionStart: number;
};
