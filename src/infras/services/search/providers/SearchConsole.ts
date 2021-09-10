/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-console */
import { ISearchProvider } from '../interfaces/ISearchProvider';

export class SearchConsole implements ISearchProvider {
    async create(body: any): Promise<void> {
        console.log('Create to search', body);
    }

    async bulkCreate(body: any[]): Promise<void> {
        console.log('Create bulk to search', body);
    }

    async bulkDelete(body: any[]): Promise<void> {
        console.log('Delete bulk to search', body);
    }
}
