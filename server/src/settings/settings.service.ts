// src/settings/settings.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Settings, SettingsDocument } from '../Schemas/settings.schema';
import { Model } from 'mongoose';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Settings.name) private model: Model<SettingsDocument>,
  ) {}

  async getSettings() {
    const [settings] = await this.model.find();
    return settings || this.model.create({}); // default to true
  }

  async updateShowEvents(value: boolean) {
    const existing = await this.model.findOne();
    if (existing) {
      existing.showEvents = value;
      return existing.save();
    } else {
      return this.model.create({ showEvents: value });
    }
  }
}
