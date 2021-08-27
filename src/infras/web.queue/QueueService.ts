import * as path from 'path';
import { getFilesSync } from '@utils/file';
import { Container } from 'typedi';

export class QueueService {
    setup(): void {
        const folder = path.join(__dirname, './queues');
        getFilesSync(folder).forEach(file => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const job = require(`${folder}/${file}`).default;
            const con = Container.get(job) as any;
            con.init();
        });
    }
}
