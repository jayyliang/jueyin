import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { CreateArticleDto, PublishArticleDto } from '../../dtos/article.dto';
import { ArticleEntity } from '../../entities/article.entity';
import {
  FindManyOptions,
  LessThanOrEqual,
  Repository,
  EntityManager,
} from 'typeorm';
import { UserEntity } from '../../entities/user.entity';
import { CategoryEntity } from '../../entities/category.entity';
import { ScheduleRecordEntity } from '../../entities/schedule-record.entity';

import { PaginationService } from '../../services/pagination.service';
import { Cron } from '@nestjs/schedule';
@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(ScheduleRecordEntity)
    private scheduleRecordRepository: Repository<ScheduleRecordEntity>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async getArticles(params: { page: number; pageSize: number }) {
    const paginationService = new PaginationService<ArticleEntity>(
      this.articleRepository,
    );
    const res = await paginationService.paginate({
      ...params,
      options: {
        select: ['id', 'categoryId', 'introduction', 'title', 'creatorName'],
        where: { status: 1, isDeleted: 0 },
      },
    });
    return res;
  }

  async createOrUpdate(
    createArticleDto: CreateArticleDto,
    creatorId: number,
  ): Promise<number> {
    const userInfo = await this.userRepository.findOne({
      where: { id: creatorId },
      select: ['username', 'id'],
    });
    if (createArticleDto?.id) {
      if (creatorId !== userInfo.id) {
        throw Error('无权限修改');
      }
      await this.articleRepository.update(
        { id: createArticleDto.id },
        createArticleDto,
      );
      return createArticleDto.id;
    } else {
      const res = await this.articleRepository.save(
        Object.assign({}, createArticleDto, {
          creatorName: userInfo.username,
          creatorId: userInfo.id,
        }),
      );
      return res.id;
    }
  }

  async publish(publishArticleDto: PublishArticleDto) {
    const id = publishArticleDto.id;
    if (publishArticleDto.time) {
      // 往定时任务表塞数据
      const record = await this.scheduleRecordRepository.findOne({
        where: { targetId: id, type: 1, status: 0 },
      });
      if (record) {
        record.excutionTime = publishArticleDto.time;
        await this.scheduleRecordRepository.update({ id: record.id }, record);
      } else {
        await this.scheduleRecordRepository.save({
          targetId: id,
          type: 1,
          status: 0,
          excutionTime: publishArticleDto.time,
        });
      }
    }
    const time = publishArticleDto.time;
    delete publishArticleDto.time;
    let article = await this.articleRepository.findOne({ where: { id } });
    article = Object.assign({}, article, publishArticleDto, {
      status: time ? 0 : 1,
    });
    await this.articleRepository.update({ id }, article);
    return true;
  }

  async deleteArticle(articleId: number, creatorId: number) {
    const article = await this.articleRepository.findOne({
      where: { id: articleId, creatorId },
    });
    if (!article) {
      throw Error('删除失败');
    }
    await this.articleRepository.update({ id: articleId }, { isDeleted: 1 });
    return true;
  }

  async getArticleInfo(id: number) {
    return await this.articleRepository.findOne({ where: { id } });
  }

  async getMyArticle(creatorId: number) {
    const list =
      (await this.articleRepository.find({
        where: { creatorId, isDeleted: 0 },
        select: [
          'createdTime',
          'updatedTime',
          'id',
          'title',
          'status',
          'introduction',
        ],
      })) || [];
    return {
      published: list.filter((item) => item.status === 1),
      draft: list.filter((item) => item.status === 0),
    };
  }

  async getArticleList(
    pageNo: number,
    pageSize: number,
    categoryId?: number,
    order?: string,
  ) {
    const offset = (pageNo - 1) * pageSize;
    let options: FindManyOptions<ArticleEntity> = {
      skip: offset,
      take: pageSize,
      where: {},
    };
    if (categoryId) {
      options.where = Object.assign({}, options.where, { categoryId });
    }
    if (order) {
      options.order = {
        [order]: 'desc',
      };
    }
    const res = await this.articleRepository.find(options);
    return res;
  }

  async getCategoryList() {
    return await this.categoryRepository.find();
  }

  @Cron('15 * * * * *') // 每分钟第15秒执行一次
  async schedulePublishAriticle() {
    const currentTime = new Date();
    const records = await this.scheduleRecordRepository.find({
      where: {
        status: 0,
        type: 1,
        excutionTime: LessThanOrEqual(currentTime),
      },
    });

    if (records.length === 0) {
      return;
    }
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      const tragetIds = records.map((record) => record.targetId);
      const ids = records.map((record) => record.id);
      /**把文章状态从草稿更新到发布 */
      await transactionalEntityManager.update(
        ArticleEntity,
        { id: tragetIds },
        { status: 1 },
      );
      /**把定时任务状态更新为成功 */
      await transactionalEntityManager.update(
        ScheduleRecordEntity,
        { id: ids },
        { status: 1 },
      );
    });
  }
}
