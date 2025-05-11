export class IUserClass<LocalData = object> {
    /** @description The key to store the local data in the local storage, generally the class name */
    key: string;

    constructor(key: string) {
        this.key = key;
    }

    Clear = () => {};

    /** @description Set the local data from the local storage */
    Load: (data: Partial<LocalData>) => void = () => {};

    /** @description Get the local data to save to the local storage */
    Save: () => LocalData = () => {
        return {} as LocalData;
    };
}
