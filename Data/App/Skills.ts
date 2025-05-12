import { LangType } from '@/Global/Langs';
import { EnrichedXPInfo } from '@/Class/Experience';

export interface Skill {
    ID: number;
    Name: LangType;
    CategoryID: number;
    Stats: {
        int: number;
        soc: number;
        for: number;
        sta: number;
        agi: number;
        dex: number;
    };
    LogoID: number;
    Creator: string;
    XP: number;
    Enabled: boolean;
}

export interface EnrichedSkill extends Skill {
    FullName: string;
    LogoXML: string;
    Experience: EnrichedXPInfo;
}

export type GeneratedSkill = Omit<Skill, 'ID' | 'LogoID' | 'Creator' | 'Enabled'>;
