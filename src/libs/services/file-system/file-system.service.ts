import { Injectable } from '@nestjs/common';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { randomInt } from 'crypto';
import { v2 as cloudinary } from 'cloudinary';
//import { CloudinaryService } from '@nestjs/cloudinary';

@Injectable()
export class FileSystemService {
  constructor(private readonly configService: ConfigService) {}

  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  });

  private readonly cloudinary = cloudinary.config({
    cloud_name: this.configService.getOrThrow('CLOUDINARY_CLOUD_NAME'),
    api_key: this.configService.getOrThrow('CLOUDINARY_API_KEY'),
    api_secret: this.configService.getOrThrow('CLOUDINARY_API_SECRET'),
  });

  private awsS3Bucket = this.configService.getOrThrow('AWS_S3_BUCKET');

  public async uploadFileToAWS(file: Express.Multer.File): Promise<string>
  {
    const s3Client = new S3Client({
      region: this.configService.getOrThrow('AWS_S3_REGION'),
    });

    // generate 50 random alphabets
    const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    // create a function that splits a mime type into an array by /
    const fileTypeExt = file.mimetype.split('/')[1];
    const objectKey = `${randomInt(10000, 999999)}_${Date.now()}_${randomString}.${fileTypeExt}`;

    // Save the new picture
    await s3Client.send(
      new PutObjectCommand({
        Bucket: this.configService.getOrThrow('AWS_S3_BUCKET'),
        Key: objectKey,
        Body: file.buffer,
        ContentType: file.mimetype
      }),
    );

    // Construct the object URL
    return `https://${this.awsS3Bucket}.s3.amazonaws.com/${objectKey}`;
  }

  public async deleteFileFromAWS(objectURL: string)
  {
    const splitParts = objectURL.split(`https://${this.awsS3Bucket}.s3.amazonaws.com/`);
    if (splitParts.length === 2) {
      const objectKey = splitParts[1];
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.awsS3Bucket,
          Key: objectKey,
        }),
      );
    } else {
      // Find a way to handle this error.
      console.log('Invalid S3 objectURL');
    }

    return true;
  }

  // Cloudinary Endpoints
  public async uploadFileToCloudinary(file: Express.Multer.File){
    const result = await this.cloudinary.uploader.upload(
      file.path,
      {
        folder: 'user-services',
        // Optional: Add more options like transformations, tags, etc.
      },
    );
    return result;
    // return new Promise((resolve, reject) => {
    //   this.cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
    //     if (error) {
    //       reject(error);
    //     }
    //     resolve(result.url);
    //   }).end(file.buffer);
    // });
  }

  public async deleteFileFromCloudinary(publicId: string){
    return new Promise((resolve, reject) => {
      this.cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  }

}
