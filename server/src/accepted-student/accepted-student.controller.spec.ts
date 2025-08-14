import { Test, TestingModule } from '@nestjs/testing';
import { AcceptedStudentController } from './accepted-student.controller';

describe('AcceptedStudentController', () => {
  let controller: AcceptedStudentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AcceptedStudentController],
    }).compile();

    controller = module.get<AcceptedStudentController>(AcceptedStudentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
