import { DB_CACHING_HOST, DB_CACHING_PASSWORD, DB_CACHING_PORT } from '@configs/Configuration';
import { IQueueJobService } from '@gateways/services/IQueueJobService';
import { Processor, Queue, QueueOptions, QueueScheduler, QueueSchedulerOptions, Worker, WorkerOptions } from 'bullmq';
import IORedis from 'ioredis';
import { Service } from 'typedi';

@Service('queue_job.service')
export class QueueJobService implements IQueueJobService {
    private readonly _connection: IORedis.Redis;
    private readonly _queues: Queue[] = [];

    constructor() {
        // this._connection = new IORedis(DB_CACHING_HOST, DB_CACHING_PORT, {
        //     password: DB_CACHING_PASSWORD,
        //     keyPrefix: undefined // Will got some issues about monitor, just disable this.
        // });
        this._connection = new IORedis(DB_CACHING_PORT, DB_CACHING_HOST, {
            password: DB_CACHING_PASSWORD,
            keyPrefix: undefined
        });
        this._connection.setMaxListeners(20);
    }

    initQueue(name: string, useScheduler: boolean, opts: QueueOptions = {}, scheduleOpts: QueueSchedulerOptions = {}): Queue {
        let queue = this._queues.find(queue => queue.name === name);
        if (queue)
            return queue;

        if (useScheduler) {
            // eslint-disable-next-line no-new
            new QueueScheduler(name, {
                connection: this._connection,
                ...scheduleOpts
            });
        }

        queue = new Queue(name, {
            connection: this._connection,
            ...opts
        });
        this._queues.push(queue);
        return queue;
    }

    initWorker(name: string, processor: Processor, opts: WorkerOptions = {}): Worker {
        const worker = new Worker(name, processor, {
            connection: this._connection,
            ...opts
        });
        return worker;
    }

    getQueue(name: string): Queue {
        const queue = this._queues.find(queue => queue.name === name);
        if (!queue)
            throw new Error('The queue name is not exist!');
        return queue;
    }
}
