import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ArticleService } from './article.service';
import { User } from 'src/decorators/user.decorator';
import {
  CreateArticleDto,
  PublishArticleDto,
  SearchArticleDto,
} from 'src/dtos/article.dto';
import { NoAuth } from '../../decorators/no-auth.decorator';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('getArticles/:pageNo/:pageSize')
  async getArticles(
    @Param('pageNo') pageNo: number,
    @Param('pageSize') pageSize: number,
  ) {
    return await this.articleService.getArticles({ page: pageNo, pageSize });
  }

  @Post('createOrUpdate')
  async createOrUpdate(
    @User('id') userId: number,
    @Body() createArticleDto: CreateArticleDto,
  ) {
    if (!createArticleDto.title && !createArticleDto.content) {
      throw Error('标题和内容不能同时为空');
    }
    const res = await this.articleService.createOrUpdate(
      createArticleDto,
      userId,
    );
    return res;
  }

  @Post('publish')
  async publish(@Body() publishArticleDto: PublishArticleDto) {
    await this.articleService.publish(publishArticleDto);
    return true;
  }

  @Post('deleteArticle')
  async deleteArticle(
    @Body('id') articleId: number,
    @User('id') userId: number,
  ) {
    await this.articleService.deleteArticle(articleId, userId);
    return true;
  }

  @Get('getArticleInfo')
  async getArticleInfo(@Query('id') articleId: number) {
    return await this.articleService.getArticleInfo(articleId);
  }

  @Get('getMyArticle')
  async getMyArticle(@User('id') userId: number) {
    return await this.articleService.getMyArticle(userId);
  }

  @Get('getCategoryList')
  async getCategoryList() {
    return await this.articleService.getCategoryList();
  }

  @Post('searchArticle')
  async searchArticle(@Body() searchDto: SearchArticleDto) {
    return await this.articleService.searchArticle(searchDto);
  }

  @NoAuth()
  @Get('pushAllArticles')
  async pushAllArticles() {
    return await this.articleService.pushAllArticles();
  }
}
