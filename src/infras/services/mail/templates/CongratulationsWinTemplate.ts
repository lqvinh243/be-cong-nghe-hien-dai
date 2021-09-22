import { DOMAIN_APP, PROTOTYPE_APP } from '@configs/Configuration';
import { Product } from '@domain/entities/product/Product';
import Mailgen from 'mailgen';

export class CongratulationsWinTemplate {
    static getTemplate(name: string, product: Product): Mailgen.Content {
        return {
            body: {
                name,
                intro: `Chúc mừng bạn là người chiến thắng cho sản phẩm ${product.name} với mức giá ${product.priceNow}.`,
                action: {
                    instructions: 'Để xem danh sách đã chiến thắng vui lòng truy cập:',
                    button: {
                        color: '#22BC66',
                        text: 'Chi tiết',
                        link: `${PROTOTYPE_APP}://${DOMAIN_APP}/bidder/product`
                    }
                }
            }
        };
    }
}
