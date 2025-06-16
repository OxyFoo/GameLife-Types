export class IUserData<LocalData> {
    key: string;

    constructor(key: string) {
        this.key = key;
    }

    /** @description Clear data & reset the class */
    Clear: () => void | Promise<void> = () => {};

    /** @description Unmount the class to free up resources */
    Unmount: () => void | Promise<void> = () => {};

    Get: () => unknown = () => {};

    /** @description Set the local data from the local storage */
    Load: (data: Partial<LocalData>) => void = () => {};

    /** @description Get the local data to save to the local storage */
    Save: () => LocalData = () => {
        return {} as LocalData;
    };

    LoadOnline: () => Promise<boolean> = () => Promise.resolve(true);

    /** @description Save the unsaved data to the server */
    SaveOnline: () => Promise<boolean> = () => Promise.resolve(true);
}
