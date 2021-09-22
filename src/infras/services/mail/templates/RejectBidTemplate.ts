import { DOMAIN_APP, PROTOTYPE_APP } from '@configs/Configuration';
import { Product } from '@domain/entities/product/Product';
import Mailgen from 'mailgen';

export class RejectBidTemplate {
    static getTemplate(name: string, product: Product): Mailgen.Content {
        return {
            body: {
                name,
                intro: `Rất tiếc người bán đã từ chối bạn ra giá cho sản phẩm giá ${product.name}.`,
                action: {
                    instructions: 'Để em các sản phẩm khác vui lòng truy cập:',
                    button: {
                        color: '#22BC66',
                        text: 'Chi tiết',
                        link: `${PROTOTYPE_APP}://${DOMAIN_APP}`
                    }
                }
            }
        };
    }
}
