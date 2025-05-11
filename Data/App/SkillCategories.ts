import { LangType } from '@/Global/Langs';

export interface SkillCategory {
    ID: number;
    Name: LangType;
    /** HEX color */
    Color: string;
    LogoID: number;
}
