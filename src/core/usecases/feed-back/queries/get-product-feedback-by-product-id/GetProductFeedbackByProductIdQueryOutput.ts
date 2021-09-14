import { ProductFeedback } from '@domain/entities/feed-back/ProductFeedback';
import { ProductFeedbackType } from '@domain/enums/feed-back/ProductFeedbackType';
import { RefSchemaObject } from '@shared/decorators/RefSchema';
import { DataResponse } from '@shared/usecase/DataResponse';
import { IsObject } from 'class-validator';

export class GetProductFeedbackByProductIdQueryData {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    content: string;
    type: ProductFeedbackType;

    constructor(data: ProductFeedback) {
        this.id = data.id;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.content = data.content;
        this.type = data.type;
    }
}

export class GetProductFeedbackByProductIdQueryOutput extends DataResponse<GetProductFeedbackByProductIdQueryData | null> {
    @IsObject()
    @RefSchemaObject(GetProductFeedbackByProductIdQueryData)
    data: GetProductFeedbackByProductIdQueryData | null;

    isReady: boolean;

    setData(data: ProductFeedback | null): void {
        this.isReady = !!data;
        this.data = data && new GetProductFeedbackByProductIdQueryData(data);
    }
}
