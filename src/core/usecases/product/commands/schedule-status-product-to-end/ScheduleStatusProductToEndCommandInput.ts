import { IsString } from 'class-validator';

export class ScheduleStatusProductToEndCommandInput {
    @IsString()
    id: string;
}
