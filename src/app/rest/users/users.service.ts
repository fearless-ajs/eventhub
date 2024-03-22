/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { events } from '@config/constants';
import { generateSixDigitToken } from '@libs/helpers/char-generator';
import { UpdateMyProfileDto } from '@app/rest/auth/dto/shared/update-my-profile.dto';
import { FileSystemService } from '@libs/services/file-system/file-system.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/shared/create-user.dto';
import { UserEvent } from './events/user.event';
import { UpdateUserDto } from './dto/shared/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
    private readonly fileSystemService: FileSystemService,
  ) {}
  
  async create(createUserDto: CreateUserDto) {
    const {
      password,
      email,
      firstname,
      lastname
    } = createUserDto;

    // CHeck if the phone number already exists.
    if (await this.findOneByEmail(email)) throw new ConflictException(`Email exist, check the email`);

    // generate verification code
    const emailVerificationToken = generateSixDigitToken();

    const salt = await bcrypt.genSalt();
    // Generating the hashed version of the password
    const hashedPassword = await bcrypt.hashSync(password, salt)
    
    const user = await this.dataSource.transaction(async manager => {
      // Create a user entity;
      const newUser = this.repo.create({
        lastname,
        firstname,
        email,
        password: hashedPassword,
        emailVerificationToken
      });

      // Save user data
      return await manager.save<User>(newUser);
    });

    // Emit a user created Event
    this.eventEmitter.emit(events.USER_CREATED, new UserEvent(user));
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.repo.findOneBy({ email });
  }

  async findOneByEmailExceptCurrentUser(email: string, userId: number): Promise<User> {
    return await this.repo
      .createQueryBuilder('user')
      .where('user.id != :userId', { userId })
      .where('user.email = :email', { email: email })
      .getOne();
  }


  async findOneById(id: number): Promise<User> {
    return this.repo.findOneBy({ id });
  }

  async checkUserPasswordToken(verificationToken:number):Promise<User> {
    return this.repo.findOneBy({ passwordResetToken: verificationToken });
  }

  async checkUserPasswordWithTokenAndEmail(email: string, verificationToken:number):Promise<User> {
    return this.repo.findOneBy({ passwordResetToken: verificationToken, email: email });
  }


  async checkUserVerificationToken(verificationToken:number):Promise<User> {
    return this.repo.findOneBy({emailVerificationToken: verificationToken, emailVerifiedAt: null});
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: number) {
    return await this.repo
      .createQueryBuilder('user')
      .where('user.id = :id', { id: id })
      .getOne();
  }

  async validateUser(email: string, password: string) {
    const user = await this.findOneByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) throw new UnauthorizedException('Invalid credentials');

    // Check if user email is verified
    if (!user.emailVerifiedAt) throw new BadRequestException('Unverified account');

    return user;
  }

  async findOneByIdAndUpdate(id: number, userData: Partial<User>): Promise<User>{
    // Step 1: Retrieve the entity
    const entityToUpdate = await this.repo.findOneBy({ id });

    // Check if the entity exists
    if (!entityToUpdate)
      throw new NotFoundException(`User with ID ${id} not found`);

    // // delete the existing picture.
    // if (entityToUpdate.picture && userData.picture)
    // {
    //   // delete old picture
    //   await deleteFile(entityToUpdate.picture);
    //
    //   // Save the new picture
    //   th
    // }

    // Step 2: Modify the entity with new data
    Object.assign(entityToUpdate, userData);

    // Step 3: Save the updated entity
    return await this.repo.save(entityToUpdate);
  }


  async updateUserProfile(id: number, userData: UpdateMyProfileDto): Promise<User>{
    // Step 1: Retrieve the entity
    const entityToUpdate = await this.repo.findOneBy({ id });

    // Check if the entity exists
    if (!entityToUpdate)
      throw new NotFoundException(`User with ID ${id} not found`);

    // delete the existing picture.
    if (userData.picture){
      const { picture } = userData;

      // Update the new picture
      userData.picture = await this.fileSystemService.uploadFileToAWS(picture);

      if (entityToUpdate.picture)
        // delete old picture
        await this.fileSystemService.deleteFileFromAWS(entityToUpdate.picture);
    }

    // Step 2: Modify the entity with new data
    Object.assign(entityToUpdate, userData);

    // Step 3: Save the updated entity
    return await this.repo.save(entityToUpdate);
  }



  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
