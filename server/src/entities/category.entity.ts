import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({
  name: 'categorys',
})
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn({
    name: 'created_time',
  })
  createdTime: Date;

  @UpdateDateColumn({
    name: 'updated_time',
  })
  updatedTime: Date;
}
