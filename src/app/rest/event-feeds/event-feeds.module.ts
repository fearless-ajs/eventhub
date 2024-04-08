import { Module } from '@nestjs/common';
import { EventFeedsService } from './event-feeds.service';
import { EventFeedsController } from './event-feeds.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventFeed } from './entities/event-feed.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventFeed]),
    UsersModule
  ],
  controllers: [EventFeedsController],
  providers: [EventFeedsService],
  exports: [EventFeedsService]
})
export class EventFeedsModule {}
