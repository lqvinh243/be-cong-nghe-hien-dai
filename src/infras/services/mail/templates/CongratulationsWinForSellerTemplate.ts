import { DOMAIN_APP, PROTOTYPE_APP } from '@configs/Configuration';
import { Product } from '@domain/entities/product/Product';
import Mailgen from 'mailgen';

export class CongratulationsWinForSellerTemplate {
    static getTemplate(name: string, product: Product): Mailgen.Content {
        return {
            body: {
                name,
                intro: `Sản phẩm ${product.name} đã hoàn tất và tìm ra người chiến thắng.`,
                action: {
                    instructions: 'Để xem danh sách sản phẩm đã hoàn tất vui lòng truy cập:',
                    button: {
                        color: '#22BC66',
                        text: 'Danh sách',
                        link: `${PROTOTYPE_APP}://${DOMAIN_APP}/seller/product`
                    }
                }
            }
        };
    }
}
