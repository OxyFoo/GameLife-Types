import { LangKeys } from '@/Global/Langs';

export interface Account {
    Username: string;
    Lang: LangKeys;
    LastChangeUsername: number | null;
    Title: number;
    Ox: number;
    Birthtime: number | null;
    LastChangeBirth: number | null;
    AccountAge: number;
    AdRemaining: number;
    /** Expiry (unix seconds) of the used weekly base-price slot for activity deletions/editions, null if available */
    OxFreeSlotUntil: number | null;
}
