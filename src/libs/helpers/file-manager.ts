import * as fs from "fs";
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomInt } from 'crypto';
import { ConfigService } from '@nestjs/config';


const configService = new ConfigService();

export  const deleteFile = async (fileName: string)  =>
{
  if (fileName){
    fs.unlink(`${fileName}`, (err) => {
      if (err) {
        //console.error(err);
        return err;
      }
    });
  }
}

export const uploadFile = async (file: Express.Multer.File): Promise<string> =>
{
  const s3Client = new S3Client({
    region: configService.getOrThrow('AWS_S3_REGION'),
  });


  // create a function that splits a mime type into an array by /
  const fileTypeExt = file.mimetype.split('/')[1];
  const objectKey = `${randomInt(10000, 999999)}_${Date.now()}_profile_picture.${fileTypeExt}`;

  // Save the new picture
  await s3Client.send(
    new PutObjectCommand({
      Bucket: configService.getOrThrow('AWS_S3_BUCKET'),
      Key: objectKey,
      Body: file.buffer,
      ContentType: file.mimetype
    }),
  );

  // Construct the object URL
  const awsS3Bucket = configService.getOrThrow('AWS_S3_BUCKET');
  return `https://${awsS3Bucket}.s3.amazonaws.com/${objectKey}`;
}