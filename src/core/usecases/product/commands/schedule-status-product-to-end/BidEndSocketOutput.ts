import { Client } from '@domain/entities/user/Client';
import { ProductStatus } from '@domain/enums/product/ProductStatus';
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

export class BidEndSocketOutput {
    id: string;
    status: ProductStatus;
    price: number;
    winner: ClientData;

    setWinner(data: Client): void {
        this.winner = new ClientData(data);
    }
}
