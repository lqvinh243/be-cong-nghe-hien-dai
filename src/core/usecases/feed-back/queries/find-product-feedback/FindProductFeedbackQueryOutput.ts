import { ProductFeedback } from '@domain/entities/feed-back/ProductFeedback';
import { RefSchemaArray } from '@shared/decorators/RefSchema';
import { PaginationResponse } from '@shared/usecase/PaginationResponse';
import { IsArray, IsDateString, IsUUID } from 'class-validator';

export class FindProductFeedbackQueryData {
    @IsUUID()
    id: string;

    @IsDateString()
    createdAt: Date;

    constructor(data: ProductFeedback) {
        this.id = data.id;
        this.createdAt = data.createdAt;
    }
}

export class FindProductFeedbackQueryOutput extends PaginationResponse<FindProductFeedbackQueryData> {
    @IsArray()
    @RefSchemaArray(FindProductFeedbackQueryData)
    data: FindProductFeedbackQueryData[];

    setData(list: ProductFeedback[]): void {
        this.data = list.map(item => new FindProductFeedbackQueryData(item));
    }
}
