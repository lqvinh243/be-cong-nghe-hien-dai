import { ILogService } from '@gateways/services/ILogService';
import { IQueueJobService } from '@gateways/services/IQueueJobService';
import { QueueJobName } from '@shared/queue/QueueJobName';
import { Job } from 'bullmq';
import { Inject, Service } from 'typedi';

@Service()
export default class ProductStatusQueue {
    @Inject('queue_job.service')
    private readonly _queueJob: IQueueJobService;

    @Inject('log.service')
    private readonly _logService: ILogService;

    init(): void {
        this._queueJob.initQueue(QueueJobName.PRODUCT_STATUS, true);

        const worker = this._queueJob.initWorker(QueueJobName.PRODUCT_STATUS, async (job: Job) => {
            // eslint-disable-next-line no-console
            console.log(job);
        });

        worker.on('completed', (job: Job) => {
            this._logService.debug(`Product status queue successfully #${job.id}`, { data: job.data, return: job.returnvalue });
        });

        worker.on('failed', (job, error) => {
            this._logService.error(`Product status queue error #${job.id}`, { data: job.data, error });
        });
    }
}
