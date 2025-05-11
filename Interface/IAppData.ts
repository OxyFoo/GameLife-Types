export class IAppData<DataType> {
    Clear: () => void = () => {};

    Load: (data: DataType | undefined) => void = () => {};

    Save: () => DataType = () => {
        return {} as DataType;
    };

    Get: () => DataType = () => {
        return {} as DataType;
    };
}
