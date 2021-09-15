import { DOMAIN_APP, PROTOTYPE_APP } from '@configs/Configuration';
import { Product } from '@domain/entities/product/Product';
import Mailgen from 'mailgen';

export class SuccessBidTemplate {
    static getTemplate(name: string, product: Product): Mailgen.Content {
        return {
            body: {
                name,
                intro: `Chúc mừng bạn đã đặt giá thành công sản phẩm ${product.name}.`,
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
