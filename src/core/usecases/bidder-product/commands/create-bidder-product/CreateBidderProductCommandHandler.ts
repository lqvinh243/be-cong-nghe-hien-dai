import { BidderProduct } from '@domain/entities/bidder-product/BidderProduct';
import { BidderProductStep } from '@domain/entities/bidder-product/BidderProductStep';
import { IBidderProductRepository } from '@gateways/repositories/bidder-product/IBidderProductRepository';
import { IBidderProductStepRepository } from '@gateways/repositories/bidder-product/IBidderProductStepRepository';
import { IProductRepository } from '@gateways/repositories/product/IProductRepository';
import { IDbContext } from '@shared/database/interfaces/IDbContext';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { CreateClientCommandOutput } from '@usecases/user/client/commands/create-client/CreateClientCommandOutput';
import { validateDataInput } from '@utils/validator';
import { Inject, Service } from 'typedi';
import { CreateBidderProductCommandInput } from './CreateBidderProductCommandInput';
import { CreateBidderProductCommandOutput } from './CreateBidderProductCommandOutput';

@Service()
export class CreateBidderProductCommandHandler implements CommandHandler<CreateBidderProductCommandInput, CreateBidderProductCommandOutput> {
    @Inject('product.repository')
    private readonly _productRepository: IProductRepository;

    @Inject('bidder_product.repository')
    private readonly _bidderProductRepository: IBidderProductRepository;

    @Inject('bidder_product_step.repository')
    private readonly _bidderProductStepRepository: IBidderProductStepRepository;

    @Inject('db.context')
    private readonly _dbContext: IDbContext;

    async handle(param: CreateBidderProductCommandInput): Promise<CreateBidderProductCommandOutput> {
        await validateDataInput(param);

        const data = new BidderProduct();
        data.productId = param.productId;
        data.bidderId = param.userAuthId;
        data.price = param.price;

        const product = await this._productRepository.getById(data.productId);
        if (!product)
            throw new SystemError(MessageError.DATA_NOT_FOUND);
        if (data.price + product.stepPrice < product.priceNow)
            throw new SystemError(MessageError.OTHER, 'Price must be bigger old price and step price!');

        const bidderProduct = await this._bidderProductRepository.checkDataExistAndGet(data.bidderId, data.productId);

        const id = await this._dbContext.getConnection().runTransaction(async queryRunner => {
            let id: string | null = null;
            if (bidderProduct) {
                if (bidderProduct.isBlock)
                    throw new SystemError(MessageError.OTHER, 'You cannot bid this product now!');

                id = bidderProduct.id;
                await this._bidderProductRepository.update(id, data, queryRunner);
            }
            else
                id = await this._bidderProductRepository.create(data, queryRunner);

            const bidderProductStep = new BidderProductStep();
            bidderProductStep.bidderProductId = id;
            bidderProductStep.price = data.price;

            await this._bidderProductStepRepository.create(bidderProductStep, queryRunner);

            return id;
        });

        const result = new CreateClientCommandOutput();
        result.setData(id);
        return result;
    }
}
