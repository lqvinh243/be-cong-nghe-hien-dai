// import { STORAGE_UPLOAD_DIR } from '@configs/Configuration';
import { RoleId } from '@domain/enums/user/RoleId';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { UserAuthenticated } from '@shared/UserAuthenticated';
import { GetMyProfileClientQueryHandler } from '@usecases/user/client/queries/get-my-profile-client/GetMyProfileClientQueryHandler';
import { GetMyProfileClientQueryOutput } from '@usecases/user/client/queries/get-my-profile-client/GetMyProfileClientQueryOutput';
import { GetMyProfileManagerQueryHandler } from '@usecases/user/manager/queries/get-my-profile-manager/GetMyProfileManagerQueryHandler';
import { GetMyProfileManagerQueryOutput } from '@usecases/user/manager/queries/get-my-profile-manager/GetMyProfileManagerQueryOutput';
import { UploadMyAvatarCommandHandler } from '@usecases/user/user/commands/upload-my-avatar/UploadMyAvatarCommandHandler';
import { UploadMyAvatarCommandInput } from '@usecases/user/user/commands/upload-my-avatar/UploadMyAvatarCommandInput';
import { UploadMyAvatarCommandOutput } from '@usecases/user/user/commands/upload-my-avatar/UploadMyAvatarCommandOutput';
// import multer from 'multer';
import { Authorized, CurrentUser, Get, JsonController, Post, UploadedFile } from 'routing-controllers';
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

@Service()
@JsonController('/v1/me')
export class MeController {
    constructor(
        private readonly _getMyProfileClientQueryHandler: GetMyProfileClientQueryHandler,
        private readonly _getMyProfileManagerQueryHandler: GetMyProfileManagerQueryHandler,
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
