import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleController } from './article.controller';
import { ArticleEntity } from '../../entities/article.entity';
import { ArticleService } from './article.service';
import { UserEntity } from '../../entities/user.entity';
import { CategoryEntity } from '../../entities/category.entity';
import { ScheduleRecordEntity } from '../../entities/schedule-record.entity';
import { MeiliSearchService } from '../../services/meilisearch.service';
import { QueueProviderService } from '../../services/queue-provider.service';
import { BullModule } from '@nestjs/bull';
import { QUEUE } from '../../utils/constant';
import { QueueConsumerService } from '../../services/queue-consumer.service';
import { JobRecordEntity } from '../../entities/job-record.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      ArticleEntity,
      UserEntity,
      CategoryEntity,
      ScheduleRecordEntity,
      JobRecordEntity,
    ]),
    BullModule.registerQueue({
      name: QUEUE,
      // processors:
    }),
  ],
  controllers: [ArticleController],
  providers: [
    ArticleService,
    MeiliSearchService,
    QueueProviderService,
    QueueConsumerService,
  ],
})
export class ArticleModule {}
