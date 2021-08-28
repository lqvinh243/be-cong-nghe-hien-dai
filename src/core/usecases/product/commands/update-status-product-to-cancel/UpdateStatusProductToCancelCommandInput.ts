import { IsUUID } from 'class-validator';

export class UpdateStatusProductToCancelCommandInput {
    userAuthId: string;

    @IsUUID()
    id: string;
}
