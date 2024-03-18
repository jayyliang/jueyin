import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateArticleDto, PublishArticleDto } from '../../dtos/article.dto';
import { ArticleEntity } from '../../entities/article.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';
import { CategoryEntity } from '../../entities/category.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

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
    let article = await this.articleRepository.findOne({ where: { id } });
    article = Object.assign({}, article, publishArticleDto, { status: 1 });
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
}
