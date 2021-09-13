import { Product } from '@domain/entities/product/Product';
import { RefSchemaObject } from '@shared/decorators/RefSchema';
import { DataResponse } from '@shared/usecase/DataResponse';
import { IsObject } from 'class-validator';

export class FindProductFavouriteByProductIdsQueryData {
    id: string;
    isFavourite: boolean;

    constructor(data: Product) {
        this.id = data.id;
        this.isFavourite = !!(data.productFavourites && data.productFavourites.length);
    }
}

export class FindProductFavouriteByProductIdsQueryOutput extends DataResponse<FindProductFavouriteByProductIdsQueryData[]> {
    @IsObject()
    @RefSchemaObject(FindProductFavouriteByProductIdsQueryData)
    data: FindProductFavouriteByProductIdsQueryData[];

    setData(data: Product[]): void {
        this.data = data.map(item => new FindProductFavouriteByProductIdsQueryData(item));
    }
}
