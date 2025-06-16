export class IAppData<DataType> {
    /** @description Clear data & reset the class */
    Clear: () => void | Promise<void> = () => {};

    /** @description Unmount the class to free up resources */
    Unmount: () => void | Promise<void> = () => {};

    Load: (data: DataType | undefined) => void = () => {};

    Save: () => DataType = () => {
        return {} as DataType;
    };

    Get: () => DataType = () => {
        return {} as DataType;
    };
}
