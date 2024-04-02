import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({
  name: 'articles',
})
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  introduction: string;

  @Column()
  views: number;

  @Column()
  likes: number;

  @Column()
  favorites: number;

  @Column({
    name: 'creator_id',
  })
  creatorId: number;

  @Column({
    name: 'creator_name',
  })
  creatorName: string;

  @Column({
    name: 'category_id',
  })
  categoryId: number;

  @Column({
    name: 'is_deleted',
  })
  isDeleted: number;

  @Column({
    name: 'status',
  })
  status: number;

  @CreateDateColumn({
    name: 'created_time',
  })
  createdTime: Date;

  @UpdateDateColumn({
    name: 'updated_time',
  })
  updatedTime: Date;

  @Column()
  version: number;
}
