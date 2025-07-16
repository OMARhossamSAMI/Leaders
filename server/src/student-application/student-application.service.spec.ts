import { Test, TestingModule } from '@nestjs/testing';
import { StudentApplicationService } from './student-application.service';

describe('StudentApplicationService', () => {
  let service: StudentApplicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentApplicationService],
    }).compile();

    service = module.get<StudentApplicationService>(StudentApplicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
