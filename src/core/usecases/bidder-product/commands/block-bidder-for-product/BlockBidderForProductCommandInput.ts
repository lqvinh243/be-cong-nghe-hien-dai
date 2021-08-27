import { IsUUID } from 'class-validator';

export class BlockBidderForProductCommandInput {
    @IsUUID()
    id: string;

    userAuthId: string;
}
