import { Product } from '@domain/entities/product/Product';

export interface IMailService {
    sendUserActivation(name: string, email: string, activeKey: string): Promise<void>;

    resendUserActivation(name: string, email: string, activeKey: string): Promise<void>;

    sendForgotPassword(name: string, email: string, forgotKey: string): Promise<void>;

    sendSuccessBid(name: string, email: string, product: Product): Promise<void>;

    sendSuccessBidForSeller(name: string, email: string, product: Product): Promise<void>;

    sendFailBid(name: string, email: string[], product: Product): Promise<void>;

    sendCongratulationsWin(name: string, email: string, product: Product): Promise<void>;

    sendCongratulationsWinForSeller(name: string, email: string, product: Product): Promise<void>;

    sendEndBid(name: string, email: string, product: Product): Promise<void>;

    sendRejectBid(name: string, email: string, product: Product): Promise<void>;
}
