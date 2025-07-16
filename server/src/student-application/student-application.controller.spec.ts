import { Test, TestingModule } from '@nestjs/testing';
import { StudentApplicationController } from './student-application.controller';

describe('applications', () => {
  let controller: StudentApplicationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentApplicationController],
    }).compile();

    controller = module.get<StudentApplicationController>(StudentApplicationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
