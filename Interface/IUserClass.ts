export class IUserClass<LocalData = object> {
    /** @description The key to store the local data in the local storage, generally the class name */
    key: string;

    constructor(key: string) {
        this.key = key;
    }

    /** @description Clear data & reset the class */
    Clear: () => void | Promise<void> = () => {};

    /** @description Unmount the class to free up resources */
    Unmount: () => void | Promise<void> = () => {};

    /** @description Set the local data from the local storage */
    Load: (data: Partial<LocalData>) => void = () => {};

    /** @description Get the local data to save to the local storage */
    Save: () => LocalData = () => {
        return {} as LocalData;
    };
}
