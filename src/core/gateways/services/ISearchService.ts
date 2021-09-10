export interface ISearchService {
    create(body: any): Promise<void>;

    bulkCreate(body: any[]): Promise<void>;

    bulkDelete(body: any[]): Promise<void>;

}
