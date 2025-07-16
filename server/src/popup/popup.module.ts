import { MongooseModule } from '@nestjs/mongoose';
import { Popup, PopupSchema } from '../Schemas/popup.schema';
import { PopupController } from './popup.controller';
import { PopupService } from './popup.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Popup.name, schema: PopupSchema }]),
  ],
  controllers: [PopupController],
  providers: [PopupService],
})
export class PopupModule {}
