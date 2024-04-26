import { PartialType } from '@nestjs/mapped-types';
import { CreateUserServiceImageDto } from './create-user-service-image.dto';

export class UpdateUserServiceImageDto extends PartialType(CreateUserServiceImageDto) {}
