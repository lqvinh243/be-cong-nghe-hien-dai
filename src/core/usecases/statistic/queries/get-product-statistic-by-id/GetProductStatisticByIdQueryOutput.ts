import { ProductStatistic } from '@domain/entities/statistic/ProductStatistic';
import { RefSchemaObject } from '@shared/decorators/RefSchema';
import { DataResponse } from '@shared/usecase/DataResponse';
import { IsDateString, IsObject, IsUUID } from 'class-validator';

export class GetProductStatisticByIdQueryData {
    @IsUUID()
    id: string;

    @IsDateString()
    createdAt: Date;

    constructor(data: ProductStatistic) {
        this.id = data.id;
        this.createdAt = data.createdAt;
    }
}

export class GetProductStatisticByIdQueryOutput extends DataResponse<GetProductStatisticByIdQueryData> {
    @IsObject()
    @RefSchemaObject(GetProductStatisticByIdQueryData)
    data: GetProductStatisticByIdQueryData;

    setData(data: ProductStatistic): void {
        this.data = new GetProductStatisticByIdQueryData(data);
    }
}
