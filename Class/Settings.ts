import { LangKeys } from '@/Global/Langs';
import { ThemeKeys } from '@/Global/Themes';
import { MusicLinksType } from '@/Global/Links';

export type SaveObject_Settings = {
    lang: LangKeys;
    theme: ThemeKeys;
    onboardingWatched: boolean;
    testMessageReaded: boolean;
    waitingEmail: string;
    tutoFinished: boolean;
    questHeatMapIndex: number;
    regularNotificationsLastRefresh: number;
    morningNotifications: boolean;
    eveningNotifications: boolean;
    optionalUpdatesNotifications: boolean;
    statisticsEnabled: boolean;
    musicLinks: MusicLinksType;
    themeVariant: number;
};
