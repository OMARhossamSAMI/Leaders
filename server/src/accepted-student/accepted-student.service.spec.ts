import { Test, TestingModule } from '@nestjs/testing';
import { AcceptedStudentService } from './accepted-student.service';

describe('AcceptedStudentService', () => {
  let service: AcceptedStudentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AcceptedStudentService],
    }).compile();

    service = module.get<AcceptedStudentService>(AcceptedStudentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
