import { Injectable } from '@nestjs/common';
import { CreateUserServiceImageDto } from './dto/create-user-service-image.dto';
import { UpdateUserServiceImageDto } from './dto/update-user-service-image.dto';

@Injectable()
export class UserServiceImagesService {
  create(createUserServiceImageDto: CreateUserServiceImageDto) {
    return 'This action adds a new userServiceImage';
  }

  findAll() {
    return `This action returns all userServiceImages`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userServiceImage`;
  }

  update(id: number, updateUserServiceImageDto: UpdateUserServiceImageDto) {
    return `This action updates a #${id} userServiceImage`;
  }

  remove(id: number) {
    return `This action removes a #${id} userServiceImage`;
  }
}
