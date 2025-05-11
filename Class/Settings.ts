import { LangKeys } from '@/Global/Langs';
import { ThemeKeys } from '@/Global/Themes';
import { MusicLinksType } from '@/Global/Links';

export type SaveObject_Settings = {
    lang: LangKeys,
    theme: ThemeKeys,
    email: string,
    token: string,
    onboardingWatched: boolean,
    testMessageReaded: boolean,
    tutoFinished: boolean,
    questHeatMapIndex: number,
    regularNotificationsLastRefresh: number,
    morningNotifications: boolean,
    eveningNotifications: boolean,
    musicLinks: MusicLinksType,
    themeVariant: number
};
