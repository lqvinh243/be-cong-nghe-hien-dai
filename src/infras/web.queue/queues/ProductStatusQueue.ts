import { ILogService } from '@gateways/services/ILogService';
import { IQueueJobService } from '@gateways/services/IQueueJobService';
import { QueueJobProductStatusMeta } from '@shared/queue/QueueJobMeta';
import { QueueJobName } from '@shared/queue/QueueJobName';
import { ScheduleStatusProductToEndCommandHandler } from '@usecases/product/commands/schedule-status-product-to-end/ScheduleStatusProductToEndCommandHandler';
import { ScheduleStatusProductToEndCommandInput } from '@usecases/product/commands/schedule-status-product-to-end/ScheduleStatusProductToEndCommandInput';
import { Job } from 'bullmq';
import { Inject, Service } from 'typedi';

@Service()
export default class ProductStatusQueue {
    @Inject()
    private readonly _scheduleStatusProductToEndCommandHandler: ScheduleStatusProductToEndCommandHandler;

    @Inject('queue_job.service')
    private readonly _queueJob: IQueueJobService;

    @Inject('log.service')
    private readonly _logService: ILogService;

    init(): void {
        this._queueJob.initQueue(QueueJobName.PRODUCT_STATUS, true);

        const worker = this._queueJob.initWorker(QueueJobName.PRODUCT_STATUS, async (job: Job) => {
            const data = job.data as QueueJobProductStatusMeta;
            const param = new ScheduleStatusProductToEndCommandInput();
            param.id = data.id;

            return await this._scheduleStatusProductToEndCommandHandler.handle(param);
        });

        worker.on('completed', (job: Job) => {
            this._logService.debug(`Product status queue successfully #${job.id}`, { data: job.data, return: job.returnvalue });
        });

        worker.on('failed', (job, error) => {
            this._logService.error(`Product status queue error #${job.id}`, { data: job.data, error });
        });
    }
}
