import { ELike, ELikeType } from 'src/utils/constant';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({
  name: 'like_records',
})
export class LikeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'user_id',
  })
  userId: number;

  @Column({
    name: 'target_id',
  })
  targetId: number;

  @Column()
  value: ELike;

  @Column({
    name: 'type',
  })
  type: ELikeType;

  @CreateDateColumn({
    name: 'created_time',
  })
  createdTime: Date;

  @UpdateDateColumn({
    name: 'updated_time',
  })
  updatedTime: Date;
}
