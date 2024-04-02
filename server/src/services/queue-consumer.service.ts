import { Process, Processor } from '@nestjs/bull';
import { QUEUE } from '../utils/constant';
import { ArticleService } from '../modules/article/article.service';

@Processor(QUEUE)
export class QueueConsumerService {
  constructor(private articleService: ArticleService) {}
  @Process('addView')
  async handleAddView(job: any) {
    // 处理任务
    console.log('Processing job:', job.data);
    const { jobId, articleId } = job.data;
    await this.articleService.handleAddView({ jobId, articleId });
  }
}
