import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({
  name: 'schedule_records',
})
export class ScheduleRecordEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'target_id' })
  targetId: number;

  @Column()
  type: number;

  @Column()
  status: number;

  @Column({ name: 'excution_time' })
  excutionTime: Date;

  @CreateDateColumn({
    name: 'created_time',
  })
  createdTime: Date;

  @UpdateDateColumn({
    name: 'updated_time',
  })
  updatedTime: Date;
}
