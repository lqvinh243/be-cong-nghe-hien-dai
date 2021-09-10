/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { AGOLIA_ADMIN_API_KEY, AGOLIA_SEARCH_APP, SEARCH_PRODUCT_INDEX } from '@configs/Configuration';
import { Product } from '@domain/entities/product/Product';
import algoliasearch, { SearchClient, SearchIndex } from 'algoliasearch';
import { ISearchProvider } from '../interfaces/ISearchProvider';

export class AgoliaSearch implements ISearchProvider {
    private readonly _client: SearchClient;
    constructor() {
        this._client = algoliasearch(AGOLIA_SEARCH_APP, AGOLIA_ADMIN_API_KEY);
    }

    getIndex(index: string): SearchIndex {
        return this._client.initIndex(index);
    }

    async create(body: any): Promise<void> {
        const index = this.getIndex(SEARCH_PRODUCT_INDEX);
        await index.saveObjects({ objectID: body.id, ...body });
    }

    async bulkCreate(body: Product[]): Promise<void> {
        const index = this.getIndex(SEARCH_PRODUCT_INDEX);
        const bulks: any[] = [];
        for (const item of body)
            bulks.push({ objectID: item.id, ...item.toData() });

        await index.saveObjects(bulks);
    }

    async bulkDelete(_body: any[]): Promise<void> {
        await this.getIndex(SEARCH_PRODUCT_INDEX).clearObjects();
    }
}
