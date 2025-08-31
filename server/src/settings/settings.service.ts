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
    return settings || this.model.create({});
  }

  // ---- EVENTS ----
  async updateShowEvents(value: boolean) {
    const existing = await this.model.findOne();
    if (existing) {
      existing.showEvents = value;
      return existing.save();
    } else {
      return this.model.create({ showEvents: value });
    }
  }

  // ---- APPOINTMENTS ----
  async updateShowAppointments(value: boolean) {
    const existing = await this.model.findOne();
    if (existing) {
      existing.showAppointments = value;
      return existing.save();
    } else {
      return this.model.create({ showAppointments: value });
    }
  }
  // ---- AMOUNT ----
  async updateAmount(value: number) {
    return this.model.findOneAndUpdate(
      {},
      { $set: { amount: value } },
      { new: true, upsert: true },
    );
  }
}
