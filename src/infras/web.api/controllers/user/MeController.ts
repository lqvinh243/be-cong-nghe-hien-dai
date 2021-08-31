// import { STORAGE_UPLOAD_DIR } from '@configs/Configuration';
import { RoleId } from '@domain/enums/user/RoleId';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { UserAuthenticated } from '@shared/UserAuthenticated';
import { UpdateMyProfileClientCommandHandler } from '@usecases/user/client/commands/update-my-profile-client/UpdateMyProfileClientCommandHandler';
import { UpdateMyProfileClientCommandInput } from '@usecases/user/client/commands/update-my-profile-client/UpdateMyProfileClientCommandInput';
import { UpdateMyProfileClientCommandOutput } from '@usecases/user/client/commands/update-my-profile-client/UpdateMyProfileClientCommandOutput';
import { GetMyProfileClientQueryHandler } from '@usecases/user/client/queries/get-my-profile-client/GetMyProfileClientQueryHandler';
import { GetMyProfileClientQueryOutput } from '@usecases/user/client/queries/get-my-profile-client/GetMyProfileClientQueryOutput';
import { UpdateMyProfileManagerCommandHandler } from '@usecases/user/manager/commands/update-my-profile-manager/UpdateMyProfileManagerCommandHandler';
import { UpdateMyProfileManagerCommandInput } from '@usecases/user/manager/commands/update-my-profile-manager/UpdateMyProfileManagerCommandInput';
import { UpdateMyProfileManagerCommandOutput } from '@usecases/user/manager/commands/update-my-profile-manager/UpdateMyProfileManagerCommandOutput';
import { GetMyProfileManagerQueryHandler } from '@usecases/user/manager/queries/get-my-profile-manager/GetMyProfileManagerQueryHandler';
import { GetMyProfileManagerQueryOutput } from '@usecases/user/manager/queries/get-my-profile-manager/GetMyProfileManagerQueryOutput';
import { UploadMyAvatarCommandHandler } from '@usecases/user/user/commands/upload-my-avatar/UploadMyAvatarCommandHandler';
import { UploadMyAvatarCommandInput } from '@usecases/user/user/commands/upload-my-avatar/UploadMyAvatarCommandInput';
import { UploadMyAvatarCommandOutput } from '@usecases/user/user/commands/upload-my-avatar/UploadMyAvatarCommandOutput';
// import multer from 'multer';
import { Authorized, Body, CurrentUser, Get, JsonController, Post, UploadedFile } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';

// const storage = multer.diskStorage({
//     destination(_req, _file, cb) {
//         cb(null, STORAGE_UPLOAD_DIR);
//     },
//     filename(_req, file, cb) {
//         cb(null, `${file.fieldname}-${Date.now()}`);
//     }
// });

interface IUpdateMyProfile extends UpdateMyProfileClientCommandInput, UpdateMyProfileManagerCommandInput{}

@Service()
@JsonController('/v1/me')
export class MeController {
    constructor(
        private readonly _getMyProfileClientQueryHandler: GetMyProfileClientQueryHandler,
        private readonly _getMyProfileManagerQueryHandler: GetMyProfileManagerQueryHandler,
        private readonly _updateMyProfileClientCommandHandler: UpdateMyProfileClientCommandHandler,
        private readonly _updateMyProfileManagerCommandHandler: UpdateMyProfileManagerCommandHandler,
        private readonly _uploadMyAvatarCommandHandler: UploadMyAvatarCommandHandler

    ) {}

    @Get('/')
    @Authorized()
    @OpenAPI({
        description: 'Get my profile information. Applies to any user.'
    })
    async getProfile(@CurrentUser() userAuth: UserAuthenticated): Promise<GetMyProfileClientQueryOutput | GetMyProfileManagerQueryOutput> {
        switch (userAuth.roleId) {
        case RoleId.SUPER_ADMIN:
            return await this._getMyProfileManagerQueryHandler.handle(userAuth.userId);

        case RoleId.SELLER:
        case RoleId.BIDDER:
            return await this._getMyProfileClientQueryHandler.handle(userAuth.userId);

        default:
            throw new SystemError(MessageError.DATA_INVALID);
        }
    }

    @Post('/')
    @Authorized()
    @OpenAPI({ summary: 'Upload my profile' })
    @ResponseSchema(UploadMyAvatarCommandOutput)
    async uploadMyProfile(@CurrentUser() userAuth: UserAuthenticated, @Body() param: IUpdateMyProfile): Promise<UpdateMyProfileClientCommandOutput | UpdateMyProfileManagerCommandOutput> {
        switch (userAuth.roleId) {
        case RoleId.BIDDER:
        case RoleId.SELLER:
            return await this._updateMyProfileClientCommandHandler.handle(userAuth.userId, param);
        case RoleId.MANAGER:
            return await this._updateMyProfileManagerCommandHandler.handle(userAuth.userId, param);
        default:
            throw new SystemError(MessageError.DATA_INVALID);
        }
    }

    @Post('/avatar')
    @Authorized()
    @OpenAPI({ summary: 'Upload my avatar' })
    @ResponseSchema(UploadMyAvatarCommandOutput)
    async uploadMyAvatar(@UploadedFile('avatar', { required: true }) file: Express.Multer.File, @CurrentUser() userAuth: UserAuthenticated): Promise<UploadMyAvatarCommandOutput> {
        const param = new UploadMyAvatarCommandInput();
        param.file = file;
        return await this._uploadMyAvatarCommandHandler.handle(userAuth.userId, param);
    }
}
