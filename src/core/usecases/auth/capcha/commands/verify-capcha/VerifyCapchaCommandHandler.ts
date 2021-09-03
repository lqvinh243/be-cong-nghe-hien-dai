import { CAPCHA_SECRET_KEY } from '@configs/Configuration';
import { ICapchaService } from '@gateways/services/ICapchaService';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { Inject, Service } from 'typedi';
import { VerifyCapchaCommandInput } from './VerifyCapchaCommandInput';
import { VerifyCapchaCommandOutput } from './VerifyCapchaCommandOutput';

@Service()
export class VerifyCapchaCommandHandler implements CommandHandler<VerifyCapchaCommandInput, VerifyCapchaCommandOutput> {
    @Inject('capcha.service')
    private readonly _capchaService: ICapchaService;

    async handle(param: VerifyCapchaCommandInput): Promise<VerifyCapchaCommandOutput> {
        const isSuccess = await this._capchaService.siteVerify(CAPCHA_SECRET_KEY, param.response);
        const result = new VerifyCapchaCommandOutput();
        result.setData(isSuccess);
        return result;
    }
}
