import {
  Controller,
  Get,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MinioService } from '../../services/minio.service';
import { FilePipe } from '../../pipes/file.pipe';
import { NoAuth } from 'src/decorators/no-auth.decorator';
import { Response } from 'express';
import axios, { AxiosResponse } from 'axios';

@Controller('common')
export class CommonController {
  constructor(private readonly minioService: MinioService) {}
  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  @UsePipes(new FilePipe())
  async upload(@UploadedFiles() files: UploadFile[]) {
    return await this.minioService.uploadFiles(files);
  }

  @Get('getFile')
  @NoAuth()
  async getFile(@Query('name') name: string) {
    const { url } = await this.minioService.getFile(name);
    return url;
  }

  @Get('download')
  @NoAuth()
  async download(@Query('name') name: string, @Res() res: Response) {
    const { url, stat } = await this.minioService.getFile(name);
    const response: AxiosResponse = await axios.get(url, {
      responseType: 'stream',
    });
    // 设置响应头，指定内容类型为流
    res.setHeader('Content-Type', stat.metaData['content-type']);
    // 将远程资源的流式数据传输到客户端
    response.data.pipe(res);
  }
}
