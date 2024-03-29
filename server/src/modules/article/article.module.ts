import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleController } from './article.controller';
import { ArticleEntity } from '../../entities/article.entity';
import { ArticleService } from './article.service';
import { UserEntity } from '../../entities/user.entity';
import { CategoryEntity } from '../../entities/category.entity';
import { ScheduleRecordEntity } from '../../entities/schedule-record.entity';
import { MeiliSearchService } from '../../services/meilisearch.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      ArticleEntity,
      UserEntity,
      CategoryEntity,
      ScheduleRecordEntity,
    ]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService, MeiliSearchService],
})
export class ArticleModule {}
