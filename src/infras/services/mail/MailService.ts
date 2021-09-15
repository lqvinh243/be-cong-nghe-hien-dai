import { MAIL_SENDER_EMAIL, MAIL_SENDER_NAME } from '@configs/Configuration';
import { Product } from '@domain/entities/product/Product';
import { IMailService } from '@gateways/services/IMailService';
import { Service } from 'typedi';
import { MailGenerator } from './MailGenerator';
import { MailSender } from './sender/MailSender';
import { CongratulationsWinForSellerTemplate } from './templates/CongratulationsWinForSellerTemplate';
import { CongratulationsWinTemplate } from './templates/CongratulationsWinTemplate';
import { FailBidTemplate } from './templates/FailBidTemplate';
import { ForgotPasswordTemplate } from './templates/ForgotPasswordTemplate';
import { RejectBidTemplate } from './templates/RejectBidTemplate';
import { SuccessBidForSellerTemplate } from './templates/SuccessBidForSellerTemplate';
import { SuccessBidTemplate } from './templates/SuccessBidTemplate';
import { UserActivationTemplate } from './templates/UserActivationTemplate';

@Service('mail.service')
export class MailService implements IMailService {
    private readonly _sender: MailSender;
    private readonly _generator: MailGenerator;

    constructor() {
        this._sender = new MailSender();
        this._generator = new MailGenerator();
    }

    async sendRejectBid(name: string, email: string, product: Product): Promise<void> {
        const template = RejectBidTemplate.getTemplate(name, product);
        const content = this._generator.generateHtmlContent(template);
        await this._sender.sendHtml(MAIL_SENDER_NAME, MAIL_SENDER_EMAIL, email, 'Từ chối ra giá', content);
    }

    async sendSuccessBidForSeller(name: string, email: string, product: Product): Promise<void> {
        const template = SuccessBidForSellerTemplate.getTemplate(name, product);
        const content = this._generator.generateHtmlContent(template);
        await this._sender.sendHtml(MAIL_SENDER_NAME, MAIL_SENDER_EMAIL, email, 'Có lượt ra giá mới', content);
    }

    async sendCongratulationsWinForSeller(name: string, email: string, product: Product): Promise<void> {
        const template = CongratulationsWinForSellerTemplate.getTemplate(name, product);
        const content = this._generator.generateHtmlContent(template);
        await this._sender.sendHtml(MAIL_SENDER_NAME, MAIL_SENDER_EMAIL, email, 'Hoàn thành đấu giá', content);
    }

    async sendEndBid(name: string, email: string, product: Product): Promise<void> {
        const template = CongratulationsWinForSellerTemplate.getTemplate(name, product);
        const content = this._generator.generateHtmlContent(template);
        await this._sender.sendHtml(MAIL_SENDER_NAME, MAIL_SENDER_EMAIL, email, 'Hoàn thành đấu giá', content);
    }

    async sendUserActivation(name: string, email: string, activeKey: string): Promise<void> {
        const template = UserActivationTemplate.getTemplate(name, email, activeKey);
        const content = this._generator.generateHtmlContent(template);
        await this._sender.sendHtml(MAIL_SENDER_NAME, MAIL_SENDER_EMAIL, email, 'Account Activation', content);
    }

    async resendUserActivation(name: string, email: string, activeKey: string): Promise<void> {
        const template = UserActivationTemplate.getTemplate(name, email, activeKey);
        const content = this._generator.generateHtmlContent(template);
        await this._sender.sendHtml(MAIL_SENDER_NAME, MAIL_SENDER_EMAIL, email, 'Re-Sending Account Activation', content);
    }

    async sendForgotPassword(name: string, email: string, forgotKey: string): Promise<void> {
        const template = ForgotPasswordTemplate.getTemplate(name, email, forgotKey);
        const content = this._generator.generateHtmlContent(template);
        await this._sender.sendHtml(MAIL_SENDER_NAME, MAIL_SENDER_EMAIL, email, 'Forgot Your Password', content);
    }

    async sendSuccessBid(name: string, email: string, product: Product): Promise<void> {
        const template = SuccessBidTemplate.getTemplate(name, product);
        const content = this._generator.generateHtmlContent(template);
        await this._sender.sendHtml(MAIL_SENDER_NAME, MAIL_SENDER_EMAIL, email, 'Đấu giá thành công', content);
    }

    async sendFailBid(name: string, email: string[], product: Product): Promise<void> {
        const template = FailBidTemplate.getTemplate(name, product);
        const content = this._generator.generateHtmlContent(template);
        await this._sender.sendHtml(MAIL_SENDER_NAME, MAIL_SENDER_EMAIL, email, 'Đấu giá thất bại', content);
    }

    async sendCongratulationsWin(name: string, email: string, product: Product): Promise<void> {
        const template = CongratulationsWinTemplate.getTemplate(name, product);
        const content = this._generator.generateHtmlContent(template);
        await this._sender.sendHtml(MAIL_SENDER_NAME, MAIL_SENDER_EMAIL, email, 'Người chiến thắng', content);
    }
}
