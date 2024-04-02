import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QUEUE } from '../utils/constant';

@Injectable()
export class QueueProviderService {
  constructor(@InjectQueue(QUEUE) private readonly queue: Queue) {}

  async pushAddView(data: { jobId: string; articleId: number }) {
    await this.queue.add('addView', data, {
      attempts: 5, // 任务失败后的重试次数
      backoff: {
        type: 'exponential', // 两次重试之间的时间间隔将以指数形式增长
        delay: 5000, // 重试时间间隔，单位：毫秒
      },
    });
  }
}
