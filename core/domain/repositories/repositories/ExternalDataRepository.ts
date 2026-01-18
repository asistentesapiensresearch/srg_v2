export interface ExternalDataRepository {
    getRawData(sourceId: string): Promise<Record<string, any>[]>;
}