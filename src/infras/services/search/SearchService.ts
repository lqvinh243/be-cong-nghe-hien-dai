/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { SEARCH_PROVIDER } from '@configs/Configuration';
import { SearchProvider } from '@configs/Constants';
import { ISearchService } from '@gateways/services/ISearchService';
import { Service } from 'typedi';
import { ISearchProvider } from './interfaces/ISearchProvider';
import { AgoliaSearch } from './providers/AgoliaSearch';
import { ElasticSearch } from './providers/ElasticSearch';
import { SearchConsole } from './providers/SearchConsole';

@Service('search.service')
export class SearchService implements ISearchService {
    private readonly _provider: ISearchProvider;

    constructor() {
        switch (SEARCH_PROVIDER) {
        case SearchProvider.CONSOLE:
            this._provider = new SearchConsole();
            break;
        case SearchProvider.ELASTIC:
            this._provider = new ElasticSearch();
            break;
        case SearchProvider.AGOLIA:
            this._provider = new AgoliaSearch();
            break;
        }
    }

    async create(body: any): Promise<void> {
        await this._provider.create(body);
    }

    async bulkCreate(body: any[]): Promise<void> {
        await this._provider.bulkCreate(body);
    }

    async bulkDelete(body: any[]): Promise<void> {
        await this._provider.bulkDelete(body);
    }
}
