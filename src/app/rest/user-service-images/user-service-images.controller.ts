import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserServiceImagesService } from './user-service-images.service';
import { CreateUserServiceImageDto } from './dto/create-user-service-image.dto';
import { UpdateUserServiceImageDto } from './dto/update-user-service-image.dto';

@Controller('user-service-images')
export class UserServiceImagesController {
  constructor(private readonly userServiceImagesService: UserServiceImagesService) {}

  @Post()
  create(@Body() createUserServiceImageDto: CreateUserServiceImageDto) {
    return this.userServiceImagesService.create(createUserServiceImageDto);
  }

  @Get()
  findAll() {
    return this.userServiceImagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userServiceImagesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserServiceImageDto: UpdateUserServiceImageDto) {
    return this.userServiceImagesService.update(+id, updateUserServiceImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userServiceImagesService.remove(+id);
  }
}
