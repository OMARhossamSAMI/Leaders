import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Put,
} from '@nestjs/common';
import { FormFieldService } from './form-field.service';
import { FormField } from '../Schemas/form-field.schema';

@Controller('form-fields')
export class FormFieldController {
  constructor(private readonly fieldService: FormFieldService) {}

  @Get()
  async getFormFields(): Promise<FormField[]> {
    const fields = await this.fieldService.findAll();
    return fields.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  @Post()
  create(@Body() body: Partial<FormField>) {
    return this.fieldService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Partial<FormField>) {
    return this.fieldService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.fieldService.delete(id);
  }

  @Put()
  async replaceAll(@Body() body: FormField[]) {
    console.log('Received form structure:', body); // ✅ ADD THIS
    return this.fieldService.replaceAll(body);
  }
}
