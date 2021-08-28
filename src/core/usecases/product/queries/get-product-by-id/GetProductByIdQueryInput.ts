import { IsUUID } from 'class-validator';

export class GetProductByIdQueryInput {
    userAuthId: string;

    @IsUUID()
    id: string;
}
