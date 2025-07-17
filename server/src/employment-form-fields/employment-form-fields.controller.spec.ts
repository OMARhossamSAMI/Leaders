import { Test, TestingModule } from '@nestjs/testing';
import { EmploymentFormFieldsController } from './employment-form-fields.controller';

describe('EmploymentFormFieldsController', () => {
  let controller: EmploymentFormFieldsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmploymentFormFieldsController],
    }).compile();

    controller = module.get<EmploymentFormFieldsController>(EmploymentFormFieldsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
