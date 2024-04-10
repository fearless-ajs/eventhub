import { UsersService } from './../users/users.service';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateEventFeedDto } from './dto/create-event-feed.dto';
import { UpdateEventFeedDto } from './dto/update-event-feed.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { EventFeed } from './entities/event-feed.entity';
import { Request } from 'express';

const eventDataWithHostFields = [
  'eventFeed',
  'user.id', // Include the user's ID field
  'user.lastname',
  'user.firstname',
  'user.email',
  'user.picture',
  'user.phone',
  'user.deleted',
  'user.created_at'
];

@Injectable()
export class EventFeedsService {
  constructor(
    @InjectRepository(EventFeed) private readonly repo: Repository<EventFeed>,
    private readonly userService: UsersService,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createEventFeedDto: CreateEventFeedDto, userId: number) {
    const user = await this.userService.findOne(userId);
    if(!user)
      throw new NotFoundException(`User with ID ${userId} not found`);

    const eventFeed = this.repo.create(createEventFeedDto);
    eventFeed.user = user;
    return this.repo.save(eventFeed);
  }

  findAll(req: Request) {
    const { query } = req;
    const { category  } = query;

    let queryBuilder = this.repo
      .createQueryBuilder('eventFeed')
      .leftJoinAndSelect('eventFeed.user', 'user')
      .select(eventDataWithHostFields);

    if (category)
        queryBuilder.where('event.category = :category', { category });

    // Create a query builder
    return queryBuilder;
  }

  findUserAll(
    req: Request,
    userId: number
  ) {
    const { query } = req;
    const { category  } = query;

    const queryBuilder = this.repo
      .createQueryBuilder('eventFeed')
      .leftJoinAndSelect('eventFeed.user', 'user')
      .where('eventFeed.userId = :id', { id: userId })
      .select(eventDataWithHostFields)

    if (category)
      queryBuilder.where('event.category = :category', { category });

    // Create a query builder
    return queryBuilder;
  }

  async findOne(id: number) {
    const eventFeed = await this.repo
    .createQueryBuilder('eventFeed')
    .leftJoinAndSelect('eventFeed.user', 'user')
    .where('eventFeed.id = :id', { id: id })
    .select(eventDataWithHostFields)
    .getOne();

    if (!eventFeed)
      throw new NotFoundException(`Event feed not found with the id: ${id}`);

    return eventFeed;
  }

  async update(
    id: number, 
    userId: number,
    updateEventFeedDto: Partial<UpdateEventFeedDto>
  ) {
    const entityToUpdate = await this.repo.findOne({
      where: { id },
      // Get the user data
      relations: ['user'],
    })
    
    const user = await this.userService.findOneById(userId);

    // Check if the entity exists
    if (!entityToUpdate)
      throw new NotFoundException(`Event with ID ${id} not found or does not belong to the user`);

    if (entityToUpdate.user?.id !== user.id)
      throw new UnauthorizedException(`Event does not belong to the user`);
    

    return this.entityManager.transaction(async () => {
     // Step 2: Modify the entity with new data
     Object.assign(entityToUpdate, updateEventFeedDto);

     const eventFeed = await this.entityManager.save<EventFeed>(entityToUpdate);
     return eventFeed;
    });
  }

  async remove(id: number, userId: number) {
    const entityToDelete = await this.repo.findOne({
      where: { id },
      // Get the user data
      relations: ['user'],
    })
    
    const user = await this.userService.findOneById(userId);

    // Check if the entity exists
    if (!entityToDelete)
      throw new NotFoundException(`Event with ID ${id} not found or does not belong to the user`);

    if (entityToDelete.user?.id !== user.id)
      throw new UnauthorizedException(`Event does not belong to the user`);
    
    return this.repo.remove(entityToDelete);
  }
}
