/**
 * Shared time conventions — no I/O, deterministic.
 *
 * Lives in the shared package because the app and the server must agree on what "a day" is: the ox
 * budget, the skill frequency and the raid heal quota are all counted per local day, and a mismatch
 * of one day between the two sides is directly visible to the player.
 */

export const DAY_TIME = 24 * 60 * 60;

/** A moment as the app and the database store it: a UTC timestamp plus the offset it was recorded in */
export interface LocalMoment {
    /** Unix timestamp in seconds (UTC) */
    startTime: number;
    /** Hours (rounded before use: the database column is a tinyint) */
    timezone: number;
}

/** Local day index (days since epoch) in the moment's own timezone */
export function GetLocalDayIndex(at: LocalMoment): number {
    return Math.floor((at.startTime + Math.round(at.timezone) * 3600) / DAY_TIME);
}
