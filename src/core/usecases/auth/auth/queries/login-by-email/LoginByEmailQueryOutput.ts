import { DataResponse } from '@shared/usecase/DataResponse';
import { IsJWT, IsObject, IsString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

export class LoginByEmailQueryData {
    @IsJWT()
    token: string;

    @IsString()
    userId: string;

    @IsString()
    roleId: string;

    constructor(token: string, userId: string, roleId: string) {
        this.token = token;
        this.userId = userId;
        this.roleId = roleId;
    }
}
export class LoginByEmailQueryOutput extends DataResponse<LoginByEmailQueryData> {
    @IsObject()
    @JSONSchema({ type: 'object', $ref: '#/components/schemas/' + LoginByEmailQueryData.name })
    data: LoginByEmailQueryData;

    setData(param: {token: string, userId: string, roleId: string}): void {
        this.data = new LoginByEmailQueryData(param.token, param.userId, param.roleId);
    }
}
