/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-console */
import { ELASTIC_SEARCH_HOST, ELASTIC_SEARCH_PASSWORD, ELASTIC_SEARCH_PORT, ELASTIC_SEARCH_PROTOTYPE, ELASTIC_SEARCH_USERNAME, SEARCH_PRODUCT_INDEX } from '@configs/Configuration';
import { Client } from '@elastic/elasticsearch';
import { Ping } from '@elastic/elasticsearch/api/requestParams';
import { ISearchProvider } from '../interfaces/ISearchProvider';

export class ElasticSearch implements ISearchProvider {
    private readonly _client: Client;
    constructor() {
        this._client = new Client({
            node: `${ELASTIC_SEARCH_PROTOTYPE}://${ELASTIC_SEARCH_HOST}:${ELASTIC_SEARCH_PORT}`,
            auth: {
                username: ELASTIC_SEARCH_USERNAME,
                password: ELASTIC_SEARCH_PASSWORD
            },
            maxRetries: 5,
            requestTimeout: 60000
        });

        this._client.ping({ human: true } as Ping, { requestTimeout: 2000 }, function(error) {
            if (error)
                console.trace('elasticsearch cluster is down!');

            else
                console.log('All is well');
        });
    }

    async create(body: any): Promise<void> {
        await this._client.create({
            id: body.id,
            index: SEARCH_PRODUCT_INDEX,
            body
        });
    }

    async bulkCreate(body: any[]): Promise<void> {
        const bulk: any[] = [];
        body.forEach(item => {
            bulk.push({ create: { _index: SEARCH_PRODUCT_INDEX, _id: item.id } });
            bulk.push(item);
        });

        await this._client.bulk({ body: bulk });
    }

    async delete(ids: string[]): Promise<void> {
        for (const id of ids)
            this._client.delete({ id, index: SEARCH_PRODUCT_INDEX });
    }

    async bulkDelete(body: any[]): Promise<void> {
        const bulk: any[] = [];
        body.forEach(item => {
            bulk.push({ delete: { _index: SEARCH_PRODUCT_INDEX, _id: item.id } });
        });

        await this._client.bulk({ body: bulk });
    }
}
