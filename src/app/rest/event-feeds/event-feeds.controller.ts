import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, UseGuards, Req } from '@nestjs/common';
import { EventFeedsService } from './event-feeds.service';
import { CreateEventFeedDto } from './dto/create-event-feed.dto';
import { UpdateEventFeedDto } from './dto/update-event-feed.dto';
import ResponseSerializer, { IResponseWithData, IResponseWithDataCollection } from '@libs/helpers/ResponseSerializer';
import JwtAuthGuard from '@libs/Guards/jwt-auth/jwt-auth.guard';
import { Request } from 'express';
import { CurrentUser } from '@libs/decorators/current-user.decorator';
import { TJwtPayload } from '@libs/types';

@Controller('event-feeds')
export class EventFeedsController {
  constructor(private readonly eventFeedsService: EventFeedsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async create( 
    @Body() createEventFeedDto: CreateEventFeedDto,
    @CurrentUser() user: TJwtPayload
   ): Promise<IResponseWithData> {
    const response_data = await this.eventFeedsService.create(createEventFeedDto, user.userId);

    delete response_data.user.password;
    delete response_data.user.emailVerificationToken;
    delete response_data.user.passwordResetToken;
    delete response_data.user.refreshToken

    return ResponseSerializer.data(response_data);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Req() req: Request,
  ): Promise<IResponseWithData> {
    const queryBuilder = this.eventFeedsService.findAll(req);
    return await ResponseSerializer.applyHTEAOS(req, queryBuilder);
  }
  
  @Get('all/mine')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async findAllMyEvents(
    @Req() req: Request,
    @CurrentUser() user: TJwtPayload
  ): Promise<IResponseWithDataCollection> {
    const queryBuilder = this.eventFeedsService.findUserAll(req, user.userId);
    return ResponseSerializer.applyHTEAOS(req, queryBuilder);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: number): Promise<IResponseWithData> {
    const response_data = await this.eventFeedsService.findOne(id);
    return ResponseSerializer.data(response_data);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: number,
    @Body() updateEventFeedDto: UpdateEventFeedDto,
    @CurrentUser() user: TJwtPayload,
    ): Promise<IResponseWithData> {
      const response_data = await this.eventFeedsService.update(id, user.userId, updateEventFeedDto );

      delete response_data.user.refreshToken
      delete response_data.user.passwordResetToken
      delete response_data.user.password
  
      return ResponseSerializer.data(response_data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id') id: number,
    @CurrentUser() user: TJwtPayload,
  ) {
    await this.eventFeedsService.remove(id, user.userId);
    return ResponseSerializer.message("Event feed deleted successfully")
  }
}
