export interface ISearchProvider {
    create(body: any): Promise<void>;

    bulkCreate(body: any[]): Promise<void>;

    delete(ids: string[]): Promise<void>;

    bulkDelete(body: any[]): Promise<void>;
}
