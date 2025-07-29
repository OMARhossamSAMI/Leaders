import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from '../Schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private model: Model<EventDocument>) {}

  async create(dto: CreateEventDto) {
    const eventDate = new Date(dto.date);
    const now = new Date();

    // 🚫 Cannot create an event in the past
    if (eventDate < new Date(now.toDateString())) {
      throw new BadRequestException('Cannot create an event in the past.');
    }

    // ⏰ Helper to parse time like "12:30 PM" correctly
    function parseTime12Hour(timeStr: string, date: Date): Date {
      const [time, modifier] = timeStr.split(' ');
      const [hourStr, minuteStr] = time.split(':');
      let hour = parseInt(hourStr, 10);
      const minute = parseInt(minuteStr, 10);

      if (modifier === 'PM' && hour !== 12) hour += 12;
      if (modifier === 'AM' && hour === 12) hour = 0;

      const result = new Date(date);
      result.setHours(hour, minute, 0, 0);
      return result;
    }

    // 🧠 Parse and compare times
    const startDateTime = parseTime12Hour(dto.startTime, eventDate);
    const endDateTime = parseTime12Hour(dto.endTime, eventDate);

    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      throw new BadRequestException('Invalid time format.');
    }

    if (startDateTime >= endDateTime) {
      throw new BadRequestException('Start time must be before end time.');
    }

    return this.model.create({ ...dto, status: 'off' });
  }

  async findAllAdmin() {
    return this.model.find().sort({ date: 1 }).exec();
  }

  async findByTitle(title: string) {
    const event = await this.model.findOne({ title });
    if (!event)
      throw new NotFoundException(`Event titled "${title}" not found.`);
    return event;
  }

  async updateByTitle(title: string, dto: UpdateEventDto) {
    // 🛡 Ensure required fields exist
    if (!dto.date || !dto.startTime || !dto.endTime) {
      throw new BadRequestException(
        'Date, start time, and end time are required.',
      );
    }

    const eventDate = new Date(dto.date);
    const now = new Date();

    if (eventDate < new Date(now.toDateString())) {
      throw new BadRequestException('Cannot set the event date in the past.');
    }

    // ⏰ Helper for 12-hour time parsing
    function parseTime12Hour(timeStr: string, date: Date): Date {
      const [time, modifier] = timeStr.split(' ');
      const [hourStr, minuteStr] = time.split(':');
      let hour = parseInt(hourStr, 10);
      const minute = parseInt(minuteStr, 10);

      if (modifier === 'PM' && hour !== 12) hour += 12;
      if (modifier === 'AM' && hour === 12) hour = 0;

      const result = new Date(date);
      result.setHours(hour, minute, 0, 0);
      return result;
    }

    const startDateTime = parseTime12Hour(dto.startTime, eventDate);
    const endDateTime = parseTime12Hour(dto.endTime, eventDate);

    if (startDateTime >= endDateTime) {
      throw new BadRequestException('Start time must be before end time.');
    }

    const updated = await this.model.findOneAndUpdate({ title }, dto, {
      new: true,
    });

    if (!updated) {
      throw new NotFoundException(`Event titled "${title}" not found.`);
    }

    return updated;
  }

  async removeByTitle(title: string) {
    const deleted = await this.model.findOneAndDelete({ title });
    if (!deleted)
      throw new NotFoundException(`Event titled "${title}" not found.`);
  }

  async findVisibleOnWebsite() {
    const today = new Date();
    const fourDaysLater = new Date();
    fourDaysLater.setDate(today.getDate() + 7);

    return this.model
      .find({
        date: { $lte: fourDaysLater, $gte: today },
      })
      .sort({ date: 1 })
      .exec();
  }

  async upcomingVisibleNotice() {
    const today = new Date();
    const fourDaysLater = new Date();
    fourDaysLater.setDate(today.getDate() + 4);

    return this.model
      .find({
        date: { $lte: fourDaysLater, $gte: today },
      })
      .sort({ date: 1 })
      .exec();
  }
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteExpiredEvents() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const threshold = new Date(today);
    threshold.setDate(threshold.getDate() - 1); // Keep events 1 extra day

    const result = await this.model.deleteMany({ date: { $lt: threshold } });
    if (result.deletedCount) {
      console.log(`[Scheduler] Deleted ${result.deletedCount} expired events`);
    }
  }
}
