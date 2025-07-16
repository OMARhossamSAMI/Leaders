import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Popup, PopupDocument } from '../Schemas/popup.schema';
import { CreatePopupDto, UpdatePopupDto } from '../popup/dto/popup.dto';

@Injectable()
export class PopupService {
  constructor(
    @InjectModel(Popup.name) private popupModel: Model<PopupDocument>,
  ) {}

  async createPopup(data: CreatePopupDto): Promise<Popup> {
    const exists = await this.popupModel.findOne({ title: data.title });
    if (exists) {
      throw new BadRequestException('A popup with this title already exists.');
    }

    return this.popupModel.create(data);
  }

  async getAllPopups(): Promise<Popup[]> {
    return this.popupModel.find().sort({ createdAt: 1 });
  }
  async getPopupById(id: string): Promise<Popup> {
    const popup = await this.popupModel.findById(id);
    if (!popup) {
      throw new NotFoundException('Popup not found.');
    }
    return popup;
  }

  async updatePopup(id: string, data: UpdatePopupDto): Promise<Popup> {
    const popup = await this.popupModel.findById(id);
    if (!popup) {
      throw new NotFoundException('Popup not found.');
    }

    if (data.title && data.title !== popup.title) {
      const titleTaken = await this.popupModel.findOne({ title: data.title });
      if (titleTaken) {
        throw new BadRequestException(
          'Another popup with this title already exists.',
        );
      }
    }

    Object.assign(popup, data);
    return popup.save();
  }

  async deletePopup(id: string): Promise<{ message: string }> {
    const popup = await this.popupModel.findById(id);
    if (!popup) {
      throw new NotFoundException('Popup not found. Cannot delete.');
    }

    await this.popupModel.deleteOne({ _id: id });
    return { message: 'Popup deleted successfully.' };
  }

  async togglePopupStatus(id: string): Promise<Popup> {
    const popup = await this.popupModel.findById(id);
    if (!popup) {
      throw new NotFoundException('Popup not found. Cannot toggle status.');
    }

    // If trying to turn it on, check if another popup is already live
    if (popup.status === 'off') {
      const existingLive = await this.popupModel.findOne({
        status: 'on',
        _id: { $ne: id }, // exclude the current popup
      });

      if (existingLive) {
        throw new BadRequestException(
          `Only one popup can be live at a time. "${existingLive.title}" is already live.`,
        );
      }

      popup.status = 'on';
    } else {
      popup.status = 'off';
    }

    return popup.save();
  }
  async getLivePopup(): Promise<Popup> {
    const livePopup = await this.popupModel.findOne({ status: 'on' });

    if (!livePopup) {
      throw new NotFoundException('No live popup currently available.');
    }

    return livePopup;
  }
}
