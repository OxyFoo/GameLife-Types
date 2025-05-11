export interface XPInfo {
    xp: number;
    lvl: number;
    next: number;
    totalXP: number;
}

export interface EnrichedXPInfo extends XPInfo {
    lastTime: number;
}

export interface Stats {
    int: XPInfo;
    soc: XPInfo;
    for: XPInfo;
    sta: XPInfo;
    agi: XPInfo;
    dex: XPInfo;
}

export interface StatsXP {
    int: number;
    for: number;
    dex: number;
    sta: number;
    agi: number;
    soc: number;
}
