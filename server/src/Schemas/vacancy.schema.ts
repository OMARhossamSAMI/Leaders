import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VacancyDocument = Vacancy & Document;

@Schema({ timestamps: true }) // Enables createdAt and updatedAt
export class Vacancy {
  @Prop({ type: Object })
  data: Record<string, any>;

  @Prop({
    type: [
      {
        originalname: { type: String },
        path: { type: String },
      },
    ],
    default: [],
  })
  files: { originalname: string; path: string }[];

  createdAt?: Date;
  updatedAt?: Date;
}

export const VacancySchema = SchemaFactory.createForClass(Vacancy);
