import { ProductImage } from '@domain/entities/product/ProductImage';
import { FindProductImageFilter, IProductImageRepository } from '@gateways/repositories/product/IProductImageRepository';
import { Service } from 'typedi';
import { ProductImageDb } from '../../entities/product/ProductImageDb';
import { PRODUCT_IMAGE_SCHEMA } from '../../schemas/product/ProductImageSchema';
import { BaseRepository } from '../base/BaseRepository';

@Service('product_image.repository')
export class ProductImageRepository extends BaseRepository<string, ProductImage, ProductImageDb> implements IProductImageRepository {
    constructor() {
        super(ProductImageDb, PRODUCT_IMAGE_SCHEMA);
    }

    override async findAndCount(param: FindProductImageFilter): Promise<[ProductImage[], number]> {
        let query = this.repository.createQueryBuilder(PRODUCT_IMAGE_SCHEMA.TABLE_NAME);

        if (param.keyword) {
            const keyword = `%${param.keyword}%`;
            query = query.andWhere(`${PRODUCT_IMAGE_SCHEMA.TABLE_NAME}.${PRODUCT_IMAGE_SCHEMA.COLUMNS.NAME} ILIKE :keyword`, { keyword });
        }

        query = query
            .skip(param.skip)
            .take(param.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
    }

    async checkNameExist(name: string, excludeId?: string): Promise<boolean> {
        let query = this.repository.createQueryBuilder(PRODUCT_IMAGE_SCHEMA.TABLE_NAME)
            .where(`lower(${PRODUCT_IMAGE_SCHEMA.TABLE_NAME}.${PRODUCT_IMAGE_SCHEMA.COLUMNS.NAME}) = lower(:name)`, { name });

        if (excludeId)
            query = query.andWhere(`${PRODUCT_IMAGE_SCHEMA.TABLE_NAME}.${PRODUCT_IMAGE_SCHEMA.COLUMNS.ID} != :id`, { id: excludeId });

        const result = await query.getOne();
        return !!result;
    }
}
