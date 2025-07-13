import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://Behz92:Behz9204@lic.icdejxj.mongodb.net/'), // or MongoDB Atlas URI
  ],
})
export class AppModule {}
