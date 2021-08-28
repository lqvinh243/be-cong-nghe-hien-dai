import { ProductImage } from '@domain/entities/product/ProductImage';
import { ProductStatus } from '@domain/enums/product/ProductStatus';
import { IProductImageRepository } from '@gateways/repositories/product/IProductImageRepository';
import { IProductRepository } from '@gateways/repositories/product/IProductRepository';
import { IStorageService } from '@gateways/services/IStorageService';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import * as mime from 'mime-types';
import { Inject, Service } from 'typedi';
import { UploadMultipleProductImageCommandInput } from './UploadMultipleProductImageCommandInput';
import { UploadMultipleProductImageCommandOutput } from './UploadMultipleProductImageCommandOutput';

@Service()
export class UploadMultipleProductImageCommandHandler implements CommandHandler<UploadMultipleProductImageCommandInput, UploadMultipleProductImageCommandOutput> {
    @Inject('product.repository')
    private readonly _productRepository: IProductRepository;

    @Inject('product_image.repository')
    private readonly _productImageRepository: IProductImageRepository;

    @Inject('storage.service')
    private readonly _storageService: IStorageService;

    async handle(id: string, param: UploadMultipleProductImageCommandInput): Promise<UploadMultipleProductImageCommandOutput> {
        const product = await this._productRepository.getById(id);
        if (!product)
            throw new SystemError(MessageError.DATA_NOT_FOUND);
        if (![ProductStatus.DRAFT, ProductStatus.PROCESSS].includes(product.status))
            throw new SystemError(MessageError.DATA_INVALID);
        if (product.sellerId !== param.userAuthId)
            throw new SystemError(MessageError.ACCESS_DENIED);

        for (const file of param.files)
            ProductImage.validateImageFile(file);

        const productImages: ProductImage[] = [];
        for (const file of param.files) {
            const ext = mime.extension(file.mimetype);
            if (!ext)
                throw new SystemError(MessageError.PARAM_INVALID, 'avatar');

            ProductImage.validateImageFile(file);
            const imagePath = ProductImage.getImagePath(product.id, ext);
            const data = new ProductImage();
            data.productId = product.id;
            data.name = file.originalname;
            data.size = file.size;
            data.ext = ext;
            data.url = imagePath;
            data.isPrimary = false;

            const hasSucceed = await this._storageService.upload(imagePath, file.buffer, { mimetype: file.mimetype, size: file.size });
            // .finally(() => removeFile(file.path));
            if (!hasSucceed)
                throw new SystemError(MessageError.PARAM_CANNOT_UPLOAD, 'avatar');

            productImages.push(data);
        }

        await this._productImageRepository.createMultiple(productImages);
        const result = new UploadMultipleProductImageCommandOutput();
        result.setData(true);
        return result;
    }
}
