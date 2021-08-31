import { Client } from '@domain/entities/user/Client';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { validateDataInput } from '@utils/validator';
import { Inject, Service } from 'typedi';
import { UpdateMyProfileClientCommandInput } from './UpdateMyProfileClientCommandInput';
import { UpdateMyProfileClientCommandOutput } from './UpdateMyProfileClientCommandOutput';

@Service()
export class UpdateMyProfileClientCommandHandler extends CommandHandler<UpdateMyProfileClientCommandInput, UpdateMyProfileClientCommandOutput> {
    @Inject('client.repository')
    private readonly _clientRepository: IClientRepository;

    async handle(id: string, param: UpdateMyProfileClientCommandInput): Promise<UpdateMyProfileClientCommandOutput> {
        await validateDataInput(param);

        const data = new Client();
        if (param.firstName)
            data.firstName = param.firstName;
        if (param.lastName)
            data.lastName = param.lastName;
        if (param.gender)
            data.gender = param.gender;
        if (param.birthday)
            data.birthday = param.birthday;
        if (param.phone)
            data.phone = param.phone;
        if (param.address)
            data.address = param.address;
        if (param.locale)
            data.locale = param.locale;

        const client = await this._clientRepository.getById(id);
        if (!client)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        const hasSucceed = await this._clientRepository.update(id, data);
        const result = new UpdateMyProfileClientCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
