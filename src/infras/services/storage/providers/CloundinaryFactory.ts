/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Readable } from 'stream';
import { STORAGE_URL_LIVE } from '@configs/Configuration';
import { ILogService } from '@gateways/services/ILogService';
import * as streamifier from 'streamifier';
import Container from 'typedi';
import { IBucketItem } from '../interfaces/IBucketItem';
import { IStorageProvider } from '../interfaces/IStorageProvider';
import { IStorageProviderUploadOption } from '../interfaces/IStorageProviderUploadOption';
const cloudinary = require('cloudinary');

export class CloundinaryFactory implements IStorageProvider {
    private readonly _logService = Container.get<ILogService>('log.service');

    constructor(
        private readonly _cloudName: string,
        private readonly _apiKey: string,
        private readonly _apiSecret: string
    ) {
        cloudinary.v2.config({
            cloud_name: this._cloudName,
            api_key: this._apiKey,
            api_secret: this._apiSecret
        } as any);
    }

    async uploadGetUrl(buffer: Buffer): Promise<string> {
        const result = await this.streamUpload(buffer);
        return result.url;
    }

    streamUpload(buffer: Buffer): Promise<any> {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.v2.uploader.upload_stream({
                folder: 'post'
            },
            (error, result) => {
                if (result)
                    resolve(result);

                else
                    reject(error);
            }
            );
            streamifier.createReadStream(buffer).pipe(stream);
        });
    }

    async getBuckets(): Promise<string[]> {
        this._logService.info('StorageService.getBuckets');
        return [];
    }

    async getBucketPolicy(bucketName: string): Promise<string> {
        this._logService.info('StorageService.getBucketPolicy', bucketName);
        return '';
    }

    async checkBucketExist(bucketName: string): Promise<boolean> {
        this._logService.info('StorageService.checkBucketExist', bucketName);
        return true;
    }

    async createBucket(bucketName: string): Promise<void> {
        this._logService.info('StorageService.createBucket', bucketName);
    }

    async setBucketPolicy(bucketName: string, policy: string): Promise<void> {
        this._logService.info('StorageService.setBucketPolicy', { bucketName, policy });
    }

    async deleteBucket(bucketName: string): Promise<void> {
        this._logService.info('StorageService.deleteBucket', bucketName);
    }

    async deleteBucketPolicy(bucketName: string): Promise<void> {
        this._logService.info('StorageService.deleteBucketPolicy', bucketName);
    }

    async getObjects(bucketName: string, prefix?: string): Promise<IBucketItem[]> {
        this._logService.info('StorageService.getObjects', { bucketName, prefix });
        return [];
    }

    mapUrl(bucketName: string, urlPath: string): string {
        return `${STORAGE_URL_LIVE}/${bucketName}/${urlPath}`;
    }

    async upload(bucketName: string, objectName: string, _stream: string | Readable | Buffer, options?: IStorageProviderUploadOption): Promise<boolean> {
        this._logService.info('StorageService.upload', { bucketName, objectName, options });
        return true;
    }

    async download(bucketName: string, objectName: string): Promise<Buffer> {
        this._logService.info('StorageService.download', { bucketName, objectName });
        return Promise.resolve(Buffer.from('Logging'));
    }

    async delete(bucketName: string, objectName: string): Promise<boolean> {
        this._logService.info('StorageService.delete', { bucketName, objectName });
        return true;
    }
}
