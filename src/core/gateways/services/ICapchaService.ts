export interface ICapchaService {
    siteVerify(secret: string, response: string): Promise<boolean>;
}
