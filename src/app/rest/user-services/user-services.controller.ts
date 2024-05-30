import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Req, UploadedFiles, ParseFilePipeBuilder, UseInterceptors, UnprocessableEntityException } from '@nestjs/common';
import { UserServicesService } from './user-services.service';
import { CreateUserServiceDto } from './dto/create-user-service.dto';
import { UpdateUserServiceDto } from './dto/update-user-service.dto';
import JwtAuthGuard from '@libs/Guards/jwt-auth/jwt-auth.guard';
import { CurrentUser } from '@libs/decorators/current-user.decorator';
import { TJwtPayload } from '@libs/types';
import ResponseSerializer from '@libs/helpers/ResponseSerializer';
import { Request } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';

const allowedFileTypes = ['.jpeg', '.jpg', '.png'];


@Controller('services')
export class UserServicesController {
  constructor(private readonly userServicesService: UserServicesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('images', 30, {
      fileFilter: (req, file, callback) => {
        const ext = extname(file.originalname).toLowerCase();
        if (allowedFileTypes.includes(ext)) {
          callback(null, true);
        } else {
          return callback(new UnprocessableEntityException('Invalid file type, only .jpeg and .png files are allowed'), false);
        }
      }
    })
  )
  async create(
    @Body() createUserServiceDto: CreateUserServiceDto,
    @CurrentUser() user: TJwtPayload,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 3000000,
          message: 'Max file size allowed is 2MB',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: true,
        }),
    ) images: Array<Express.Multer.File>
  ) {
    createUserServiceDto.images = images;
    const respons_data = await this.userServicesService.create(createUserServiceDto, user.userId);
    return ResponseSerializer.data(respons_data);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req: Request) {
    const queryBuilder = this.userServicesService.findAll();
    return ResponseSerializer.applyHTEAOS(req, queryBuilder);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: number) {
     const response_data = await this.userServicesService.findOne(id);
     return ResponseSerializer.data(response_data);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('images', 30, {
      fileFilter: (req, file, callback) => {
        const ext = extname(file.originalname).toLowerCase();
        if (allowedFileTypes.includes(ext)) {
          callback(null, true);
        } else {
          return callback(new UnprocessableEntityException('Invalid file type, only .jpeg and .png files are allowed'), false);
        }
      }
    })
  )
  async update(
    @Param('id') id: number, 
    @Body() updateUserServiceDto: UpdateUserServiceDto,
    @CurrentUser() user: TJwtPayload,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 3000000,
          message: 'Max file size allowed is 2MB',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
    ) images: Array<Express.Multer.File>
  ) {
    updateUserServiceDto.images = images;
    const response_data = await this.userServicesService.update(
      id,
      updateUserServiceDto,
      user.userId
    );
    return ResponseSerializer.data(response_data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id') id: number,
    @CurrentUser() user: TJwtPayload
  ) {
    await this.userServicesService.remove(id, user.userId);
    return ResponseSerializer.message('Service deleted successfully');
  }
}
