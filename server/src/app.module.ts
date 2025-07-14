import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://Behz92:Behz9204@ac-o8nt2z7-shard-00-00.icdejxj.mongodb.net:27017,ac-o8nt2z7-shard-00-01.icdejxj.mongodb.net:27017,ac-o8nt2z7-shard-00-02.icdejxj.mongodb.net:27017/?replicaSet=atlas-12nls9-shard-0&ssl=true&authSource=admin',
    ), // or MongoDB Atlas URI
    TestimonialsModule, EventsModule,
  ],
})
export class AppModule {}
