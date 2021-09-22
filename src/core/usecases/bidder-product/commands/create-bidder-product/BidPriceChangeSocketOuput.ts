import { Client } from '@domain/entities/user/Client';
import { IsNumber, IsOptional, IsString } from 'class-validator';

class ClientData {
    @IsString()
    firstName: string;

    @IsString()
    @IsOptional()
    lastName: string | null;

    @IsString()
    email: string | null;

    @IsString()
    @IsOptional()
    avatar: string | null;

    @IsNumber()
    rate: number;

    constructor(data: Client) {
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.avatar = data.avatar;
    }
}

export class BidPriceChangeSocketOuput {
    id: string;
    price: number;
    bidder: ClientData | null;

    setBidder(data: Client | null): void {
        this.bidder = data && new ClientData(data);
    }
}
