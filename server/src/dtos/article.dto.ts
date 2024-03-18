import { IsNotEmpty } from 'class-validator';

export class CreateArticleDto {
  id?: number;
  title: string;
  content: string;
}

export class PublishArticleDto {
  @IsNotEmpty()
  id: number;
  @IsNotEmpty()
  introduction: string;
  @IsNotEmpty()
  categoryId: number;
}
