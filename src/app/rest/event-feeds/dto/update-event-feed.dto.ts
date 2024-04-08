import { PartialType } from '@nestjs/mapped-types';
import { CreateEventFeedDto } from './create-event-feed.dto';

export class UpdateEventFeedDto extends PartialType(CreateEventFeedDto) {}
