import { ProductImage } from '@domain/entities/product/ProductImage';
import { IProductImageRepository } from '@gateways/repositories/product/IProductImageRepository';
import { IStorageService } from '@gateways/services/IStorageService';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { validateDataInput } from '@utils/validator';
import * as mime from 'mime-types';
import { Inject, Service } from 'typedi';
import { CreateProductImageCommandInput } from './CreateProductImageCommandInput';
import { CreateProductImageCommandOutput } from './CreateProductImageCommandOutput';

@Service()
export class CreateProductImageCommandHandler implements CommandHandler<CreateProductImageCommandInput, CreateProductImageCommandOutput> {
    @Inject('product_image.repository')
    private readonly _productImageRepository: IProductImageRepository;

    @Inject('storage.service')
    private readonly _storageService: IStorageService;

    async handle(param: CreateProductImageCommandInput): Promise<CreateProductImageCommandOutput> {
        await validateDataInput(param);

        for (const file of param.files) {
            const ext = mime.extension(file.mimetype);
            if (!ext)
                throw new SystemError(MessageError.PARAM_INVALID, 'avatar');

            ProductImage.validateImageFile(file);
            const imagePath = ProductImage.getImagePath(param.productId, ext);
            const data = new ProductImage();
            data.productId = param.productId;
            data.name = file.originalname;
            data.size = file.size;
            data.ext = ext;
            data.url = imagePath;

            const hasSucceed = await this._storageService.upload(imagePath, file.path, { mimetype: file.mimetype, size: file.size });
            // .finally(() => removeFile(file.path));
            if (!hasSucceed)
                throw new SystemError(MessageError.PARAM_CANNOT_UPLOAD, 'avatar');

            await this._productImageRepository.create(data);
        }

        const result = new CreateProductImageCommandOutput();
        result.setData(true);
        return result;
    }
}
