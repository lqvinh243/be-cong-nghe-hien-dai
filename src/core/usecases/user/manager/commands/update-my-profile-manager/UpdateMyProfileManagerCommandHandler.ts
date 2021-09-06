import { Manager } from '@domain/entities/user/Manager';
import { IManagerRepository } from '@gateways/repositories/user/IManagerRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { Inject, Service } from 'typedi';
import { UpdateMyProfileManagerCommandInput } from './UpdateMyProfileManagerCommandInput';
import { UpdateMyProfileManagerCommandOutput } from './UpdateMyProfileManagerCommandOutput';

@Service()
export class UpdateMyProfileManagerCommandHandler extends CommandHandler<UpdateMyProfileManagerCommandInput, UpdateMyProfileManagerCommandOutput> {
    @Inject('manager.repository')
    private readonly _managerRepository: IManagerRepository;

    async handle(id: string, param: UpdateMyProfileManagerCommandInput): Promise<UpdateMyProfileManagerCommandOutput> {
        const data = new Manager();
        if (param.firstName)
            data.firstName = param.firstName;
        if (param.lastName)
            data.lastName = param.lastName;
        if (param.gender)
            data.gender = param.gender;
        if (param.birthday)
            data.birthday = param.birthday;

        const manager = await this._managerRepository.getById(id);
        if (!manager)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        const hasSucceed = await this._managerRepository.update(id, data);
        const result = new UpdateMyProfileManagerCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
