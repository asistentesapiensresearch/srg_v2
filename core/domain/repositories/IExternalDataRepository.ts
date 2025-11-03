export interface IExternalDataRepository {
    getRawData(sourceId: string): Promise<Record<string, any>[]>;
}