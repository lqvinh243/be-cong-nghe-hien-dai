import { Processor, Queue, QueueOptions, QueueSchedulerOptions, Worker, WorkerOptions } from 'bullmq';

export interface IQueueJobService {
    // Initialize the queue, if the queue is using 'delayed' or 'repeatable' then set 'useScheduler' is 'true', else it will be 'false'.
    initQueue(name: string, useScheduler: boolean, opts?: QueueOptions, scheduleOpts?: QueueSchedulerOptions): Queue;

    // Initialize the worker to process the job, we also can initialize multiple workers to process the jobs in parallel.
    initWorker(name: string, processor: Processor, opts?: WorkerOptions): Worker;

    // Get the queue have initialized anywhere that we need to add the job.
    getQueue(name: string): Queue;
}
