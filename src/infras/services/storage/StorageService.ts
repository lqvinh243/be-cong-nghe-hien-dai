import { Readable } from 'stream';
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME, MINIO_ACCESS_KEY, MINIO_HOST, MINIO_PORT, MINIO_SECRET_KEY, MINIO_USE_SSL, STORAGE_BUCKET_NAME, STORAGE_PROVIDER } from '@configs/Configuration';
import { StorageProvider } from '@configs/Constants';
import { IStorageService, IStorageUploadOption } from '@gateways/services/IStorageService';
import { Service } from 'typedi';
import { IStorageProvider } from './interfaces/IStorageProvider';
import { CloundinaryFactory } from './providers/CloundinaryFactory';
import { MinioFactory } from './providers/MinioFactory';
import { StorageConsoleFactory } from './providers/StorageConsoleFactory';

@Service('storage.service')
export class StorageService implements IStorageService {
    private readonly _provider: IStorageProvider;

    constructor() {
        switch (STORAGE_PROVIDER) {
        case StorageProvider.MINIO:
            this._provider = new MinioFactory(MINIO_HOST, MINIO_PORT, MINIO_USE_SSL, MINIO_ACCESS_KEY, MINIO_SECRET_KEY);
            break;

        case StorageProvider.CLOUDINARY:
            // eslint-disable-next-line no-console
            console.log(CLOUDINARY_CLOUD_NAME);
            this._provider = new CloundinaryFactory(CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET);
            break;

        case StorageProvider.CONSOLE:
        default:
            this._provider = new StorageConsoleFactory();
            break;
        }
    }

    async createBucket(policy: string): Promise<void> {
        const isExist = await this._provider.checkBucketExist(STORAGE_BUCKET_NAME);
        if (!isExist) {
            await this._provider.createBucket(STORAGE_BUCKET_NAME);
            await this._provider.setBucketPolicy(STORAGE_BUCKET_NAME, policy);
        }
    }

    mapUrl(urlPath: string): string {
        return this._provider.mapUrl(STORAGE_BUCKET_NAME, urlPath);
    }

    async upload(urlPath: string, stream: string | Readable | Buffer, options?: IStorageUploadOption): Promise<boolean> {
        return await this._provider.upload(STORAGE_BUCKET_NAME, urlPath, stream as any, options as any);
    }

    async uploadGetUrl(buffer: Buffer): Promise<string> {
        return await this._provider.uploadGetUrl(buffer);
    }

    async download(urlPath: string): Promise<Buffer> {
        return await this._provider.download(STORAGE_BUCKET_NAME, urlPath);
    }

    async delete(urlPath: string): Promise<boolean> {
        return await this._provider.delete(STORAGE_BUCKET_NAME, urlPath);
    }
}
