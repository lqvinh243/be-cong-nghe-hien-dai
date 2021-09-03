import { ICapchaService } from '@gateways/services/ICapchaService';
import axios, { AxiosInstance } from 'axios';
import { Service } from 'typedi';

@Service('capcha.service')
export class CapchaService implements ICapchaService {
    private readonly _service: AxiosInstance;

    constructor() {
        this._service = axios.create({
            baseURL: 'https://www.google.com'
        });
    }

    async siteVerify(secret: string, response: string): Promise<boolean> {
        const body = `secret=${secret}&response=${response}`;
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const result = await this._service.post('/recaptcha/api/siteverify', body, { headers: { 'Conent-Type': 'application/x-www-form-urlencoded' } });

        return result.data.success;
    }
}
