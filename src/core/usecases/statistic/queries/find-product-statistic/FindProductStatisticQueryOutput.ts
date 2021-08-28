import { ProductStatistic } from '@domain/entities/statistic/ProductStatistic';
import { RefSchemaArray } from '@shared/decorators/RefSchema';
import { PaginationResponse } from '@shared/usecase/PaginationResponse';
import { IsArray, IsDateString, IsUUID } from 'class-validator';

export class FindProductStatisticQueryData {
    @IsUUID()
    id: string;

    @IsDateString()
    createdAt: Date;

    constructor(data: ProductStatistic) {
        this.id = data.id;
        this.createdAt = data.createdAt;
    }
}

export class FindProductStatisticQueryOutput extends PaginationResponse<FindProductStatisticQueryData> {
    @IsArray()
    @RefSchemaArray(FindProductStatisticQueryData)
    data: FindProductStatisticQueryData[];

    setData(list: ProductStatistic[]): void {
        this.data = list.map(item => new FindProductStatisticQueryData(item));
    }
}
