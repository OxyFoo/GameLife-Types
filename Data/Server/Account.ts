import { LangKeys } from '@/Global/Langs';

export interface Account {
    Username: string;
    Lang: LangKeys;
    LastChangeUsername: number | null;
    Title: number;
    Ox: number;
    Birthtime: number | null;
    LastChangeBirth: number | null;
}
