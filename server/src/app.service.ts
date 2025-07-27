import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      message: 'Welcome to the Leaders API 🚀',
      description:
        'This backend powers all admin and public features for the Leaders International College platform.',
      documentation:
        'Please refer to the internal API docs or contact the development team for access.',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV ?? 'development',
    };
  }
}
