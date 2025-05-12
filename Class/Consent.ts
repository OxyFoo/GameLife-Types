export interface SaveObject_Consent {
    android_consent: {
        nonPersonalized: boolean;
        version: string;
    };
    ios_tracking: {
        enabled: boolean;
        version: string;
    };
}
