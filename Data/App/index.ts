import { Achievement } from './Achievements';
import { Ad } from './Ads';
import { Contributor } from './Contributors';
import { DailyQuestReward } from './DailyQuestReward';
import { Item } from './Items';
import { MissionType } from './Missions';
import { Quote } from './Quotes';
import { Skill } from './Skills';
import { SkillIcon } from './SkillIcons';
import { SkillCategory } from './SkillCategories';
import { Title } from './Titles';

export interface DataTypes {
    achievements: Achievement[];
    ads: Ad[];
    contributors: Contributor[];
    dailyQuestsRewards: DailyQuestReward[];
    items: Item[];
    missions: MissionType[];
    quotes: Quote[];
    skills: Skill[];
    skillIcons: SkillIcon[];
    skillCategories: SkillCategory[];
    titles: Title[];
}

export type DataHashes = {
    [K in keyof DataTypes]: number
};
