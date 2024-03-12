import { Injectable } from '@nestjs/common';
import { InjectMinio } from 'nestjs-minio';
import * as minio from 'minio';

@Injectable()
export class MinioService {
  private static readonly bucketName = 'jueyin';
  constructor(@InjectMinio() private readonly minioClient: minio.Client) {}

  async uploadFiles(files: UploadFile[]) {
    const upload = async (file: UploadFile) => {
      const res = await this.minioClient.putObject(
        MinioService.bucketName,
        file.originalname,
        file.buffer,
        file.size,
        {
          'Content-Type': file.mimetype,
        },
      );
      return {
        ...res,
        originalname: file.originalname,
        url: `http://localhost:3000/api/common/download?name=${file.originalname}`,
      };
    };
    const res = await Promise.all(files.map(upload));
    return res;
  }
  async getFile(objectName: string) {
    const [url, stat] = await Promise.all([
      this.minioClient.presignedGetObject(
        MinioService.bucketName,
        objectName,
        24 * 60 * 60,
      ),
      this.minioClient.statObject(MinioService.bucketName, objectName),
    ]);
    return { url, stat };
  }
}
