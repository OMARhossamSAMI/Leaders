import { Test, TestingModule } from '@nestjs/testing';
import { EmploymentFormFieldsService } from './employment-form-fields.service';

describe('EmploymentFormFieldsService', () => {
  let service: EmploymentFormFieldsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmploymentFormFieldsService],
    }).compile();

    service = module.get<EmploymentFormFieldsService>(EmploymentFormFieldsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
