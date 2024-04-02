import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({
  name: 'job_records',
})
export class JobRecordEntity {
  @PrimaryColumn()
  id: number;

  @Column({
    name: 'job_id',
  })
  jobId: string;
}
