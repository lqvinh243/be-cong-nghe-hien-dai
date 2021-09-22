import { IsUUID } from 'class-validator';

export class SyncProductToSearchCommandInput {
    @IsUUID()
    id: string;

    constructor(id: string) {
        this.id = id;
    }
}
