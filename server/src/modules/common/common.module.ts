import { Module } from '@nestjs/common';
import { CommonController } from './common.controller';
import { CommonService } from './common.service';
import { MinioService } from '../../services/minio.service';

@Module({
  controllers: [CommonController],
  providers: [CommonService, MinioService],
})
export class CommonModule {}
