import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EventFeedsService } from './event-feeds.service';
import { CreateEventFeedDto } from './dto/create-event-feed.dto';
import { UpdateEventFeedDto } from './dto/update-event-feed.dto';

@Controller('event-feeds')
export class EventFeedsController {
  constructor(private readonly eventFeedsService: EventFeedsService) {}

  @Post()
  create(@Body() createEventFeedDto: CreateEventFeedDto) {
    return this.eventFeedsService.create(createEventFeedDto);
  }

  @Get()
  findAll() {
    return this.eventFeedsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventFeedsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventFeedDto: UpdateEventFeedDto) {
    return this.eventFeedsService.update(+id, updateEventFeedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventFeedsService.remove(+id);
  }
}
