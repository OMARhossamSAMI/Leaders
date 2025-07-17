import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Vacancy extends Document {
  @Prop({ type: Object })
  data: Record<string, any>;
}

export const VacancySchema = SchemaFactory.createForClass(Vacancy);
