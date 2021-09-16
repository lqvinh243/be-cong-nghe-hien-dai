import { IsUUID } from 'class-validator';

export class GetProductByIdQueryInput {
    @IsUUID()
    id: string;
}
