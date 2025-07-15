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

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private model: Model<EventDocument>) {}

  async create(dto: CreateEventDto) {
    const eventDate = new Date(dto.date);
    const now = new Date();
    if (eventDate <= now) {
      throw new BadRequestException('Cannot create event in the past.');
    }
    return this.model.create({ ...dto, status: 'off' });
  }

  async findAllAdmin() {
    return this.model.find().sort({ date: -1 }).exec();
  }

  async findByTitle(title: string) {
    const event = await this.model.findOne({ title });
    if (!event)
      throw new NotFoundException(`Event titled "${title}" not found.`);
    return event;
  }

  async updateByTitle(title: string, dto: UpdateEventDto) {
    const updated = await this.model.findOneAndUpdate({ title }, dto, {
      new: true,
    });
    if (!updated)
      throw new NotFoundException(`Event titled "${title}" not found.`);
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
    fourDaysLater.setDate(today.getDate() + 4);

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
}
