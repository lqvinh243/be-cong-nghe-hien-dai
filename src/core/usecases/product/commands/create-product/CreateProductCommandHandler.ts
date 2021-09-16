import { Product } from '@domain/entities/product/Product';
import { ProductImage } from '@domain/entities/product/ProductImage';
import { ProductStatus } from '@domain/enums/product/ProductStatus';
import { IProductImageRepository } from '@gateways/repositories/product/IProductImageRepository';
import { IProductRepository } from '@gateways/repositories/product/IProductRepository';
import { IStorageService } from '@gateways/services/IStorageService';
import { IDbContext } from '@shared/database/interfaces/IDbContext';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { CreateProductStatisticCommandHandler } from '@usecases/statistic/commands/create-product-statistic/CreateProductStatisticCommandHandler';
import { CreateProductStatisticCommandInput } from '@usecases/statistic/commands/create-product-statistic/CreateProductStatisticCommandInput';
import { CreateClientCommandOutput } from '@usecases/user/client/commands/create-client/CreateClientCommandOutput';
import * as mime from 'mime-types';
import { Inject, Service } from 'typedi';
import { CreateProductCommandInput } from './CreateProductCommandInput';
import { CreateProductCommandOutput } from './CreateProductCommandOutput';

@Service()
export class CreateProductCommandHandler implements CommandHandler<CreateProductCommandInput, CreateProductCommandOutput> {
    @Inject()
    private readonly _createProductStatisticCommandHandler: CreateProductStatisticCommandHandler;

    @Inject('product.repository')
    private readonly _productRepository: IProductRepository;

    @Inject('storage.service')
    private readonly _storageService: IStorageService;

    @Inject('product_image.repository')
    private readonly _productImageRepository: IProductImageRepository;

    @Inject('db.context')
    private readonly _dbContext: IDbContext;

    async handle(param: CreateProductCommandInput): Promise<CreateProductCommandOutput> {
        if (!param.file)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'image');
        const file = param.file;
        const ext = mime.extension(param.file.mimetype);
        if (!ext)
            throw new SystemError(MessageError.PARAM_INVALID, 'avatar');

        ProductImage.validateImageFile(param.file);

        const data = new Product();
        data.name = param.name;
        data.sellerId = param.userAuthId;
        data.categoryId = param.categoryId;
        data.startPrice = param.startPrice ?? 0;
        data.priceNow = data.startPrice;
        data.bidPrice = param.bidPrice;
        data.stepPrice = param.stepPrice;
        data.expiredAt = param.expiredAt;
        data.status = ProductStatus.DRAFT;

        const id = await this._dbContext.getConnection().runTransaction(async queryRunner => {
            const id = await this._productRepository.create(data, queryRunner);
            const imagePath = ProductImage.getImagePath(id, ext);
            const productImage = new ProductImage();
            productImage.productId = id;
            productImage.name = file.originalname;
            productImage.size = file.size;
            productImage.ext = ext;
            productImage.url = imagePath;
            productImage.isPrimary = true;

            const hasSucceed = await this._storageService.upload(imagePath, file.buffer, { mimetype: file.mimetype, size: file.size });
            // .finally(() => removeFile(file.path));
            if (!hasSucceed)
                throw new SystemError(MessageError.PARAM_CANNOT_UPLOAD, 'avatar');

            await this._productImageRepository.create(productImage, queryRunner);
            return id;
        });

        const paramStatistic = new CreateProductStatisticCommandInput();
        paramStatistic.productId = id;
        this._createProductStatisticCommandHandler.handle(paramStatistic);
        const result = new CreateClientCommandOutput();
        result.setData(id);
        return result;
    }
}
