import { ProductFeedback } from '@domain/entities/feed-back/ProductFeedback';
import { RefSchemaObject } from '@shared/decorators/RefSchema';
import { DataResponse } from '@shared/usecase/DataResponse';
import { IsDateString, IsObject, IsUUID } from 'class-validator';

export class GetProductFeedbackByIdQueryData {
    @IsUUID()
    id: string;

    @IsDateString()
    createdAt: Date;

    constructor(data: ProductFeedback) {
        this.id = data.id;
        this.createdAt = data.createdAt;
    }
}

export class GetProductFeedbackByIdQueryOutput extends DataResponse<GetProductFeedbackByIdQueryData> {
    @IsObject()
    @RefSchemaObject(GetProductFeedbackByIdQueryData)
    data: GetProductFeedbackByIdQueryData;

    setData(data: ProductFeedback): void {
        this.data = new GetProductFeedbackByIdQueryData(data);
    }
}
