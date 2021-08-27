import { IsString } from 'class-validator';

export class UpdateBidderProductCommandInput {
    @IsString()
    name: string;
}
