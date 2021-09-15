import { DOMAIN_APP, PROTOTYPE_APP } from '@configs/Configuration';
import { Product } from '@domain/entities/product/Product';
import Mailgen from 'mailgen';

export class SuccessBidForSellerTemplate {
    static getTemplate(name: string, product: Product): Mailgen.Content {
        return {
            body: {
                name,
                intro: `Sản phẩm ${product.name} đã được đặt giá mới.`,
                action: {
                    instructions: 'Để xem chi tiết vui lòng truy cập:',
                    button: {
                        color: '#22BC66',
                        text: 'Chi tiết',
                        link: `${PROTOTYPE_APP}://${DOMAIN_APP}/product/${product.id}`
                    }
                }
            }
        };
    }
}
