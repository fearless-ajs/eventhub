/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UnprocessableEntityException,
  UploadedFiles,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { CreateAuthDto } from '@app/rest/auth/dto/shared/create-auth.dto';
import ResponseSerializer, {
  IResponseWithData,
} from '@libs/helpers/ResponseSerializer';
import { CreateUserDto } from './dto/shared/create-user.dto';
import { UpdateUserDto } from './dto/shared/update-user.dto';

const allowedFileTypes = ['.jpeg', '.jpg'];

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post('register')
  // @HttpCode(HttpStatus.CREATED)
  // @UseInterceptors(
  //   FilesInterceptor('userMedia', 10, {
  //     fileFilter: (req, file, callback) => {
  //       const ext = extname(file.originalname).toLowerCase();
  //       if (allowedFileTypes.includes(ext)) {
  //         callback(null, true);
  //       } else {
  //         return callback(
  //           new UnprocessableEntityException(
  //             'Invalid file type, only .jpeg files are allowed',
  //           ),
  //           false,
  //         );
  //       }
  //     },
  //     storage: diskStorage({
  //       destination: './uploads/users',
  //       filename: (req, file, callback) => {
  //         const uniqueSuffix =
  //           Date.now() + '-' + Math.round(Math.random() * 1e9);
  //         const ext = extname(file.originalname);
  //         const filename = `${uniqueSuffix}${ext}`;
  //         callback(null, filename);
  //       },
  //     }),
  //   }),
  // )
  // async onboardGuest(
  //   @UploadedFiles(
  //     new ParseFilePipeBuilder()
  //       .addFileTypeValidator({
  //         fileType: 'jpeg',
  //       })
  //       .addMaxSizeValidator({
  //         maxSize: 3000000,
  //         message: 'Max file size allowed is 2MB',
  //       })
  //       .build({
  //         errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  //         fileIsRequired: false,
  //       }),
  //   )
  //   userMedia: Array<Express.Multer.File>,
  // ): Promise<IResponseWithData> {
  //   //createAuthDto.userMedia = userMedia;
  //   // const response_data = await this.usersService.create(createAuthDto);
  //   // delete response_data.password
  //   // delete response_data.emailVerificationToken;
  //   // delete response_data.passwordResetToken;
  //   return ResponseSerializer.data('response_data');
  // }

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
