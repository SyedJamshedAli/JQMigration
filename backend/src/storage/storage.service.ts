import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private bucket: string;
  private cdnUrl: string;
  private endpoint: string;

  constructor(private configService: ConfigService) {
    this.bucket = this.configService.get<string>('STORAGE_BUCKET', 'metronic');
    this.cdnUrl = this.configService.get<string>('STORAGE_CDN_URL', '').replace(/\/$/, '');
    this.endpoint = this.configService.get<string>('STORAGE_ENDPOINT', '').replace(/\/$/, '');

    this.s3Client = new S3Client({
      region: this.configService.get<string>('STORAGE_REGION', 'ams3'),
      endpoint: this.endpoint || undefined,
      credentials: {
        accessKeyId: this.configService.get<string>('STORAGE_ACCESS_KEY_ID', ''),
        secretAccessKey: this.configService.get<string>('STORAGE_SECRET_ACCESS_KEY', ''),
      },
      forcePathStyle: true,
    });
  }

  private getFileUrl(key: string): string {
    if (this.cdnUrl) return `${this.cdnUrl}/${key}`;
    return `${this.endpoint}/${key}`;
  }

  async uploadFile(file: any, directory: string): Promise<string> {
    const filename = `${randomUUID()}_${file.originalname || 'file'}`;
    const key = `${directory}/${filename}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        CacheControl: 'public, max-age=31536000',
        ACL: 'public-read',
      }),
    );

    return this.getFileUrl(key);
  }

  async deleteFile(fileUrl: string): Promise<void> {
    let key = fileUrl;
    if (this.cdnUrl && fileUrl.startsWith(this.cdnUrl)) {
      key = fileUrl.replace(`${this.cdnUrl}/`, '');
    } else if (this.endpoint && fileUrl.startsWith(this.endpoint)) {
      key = fileUrl.replace(`${this.endpoint}/`, '');
    }

    await this.s3Client.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
    );
  }
}
