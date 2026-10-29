import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Controller, Get, Put, Body, Post, Delete } from '@nestjs/common';
import { EmploymentFormFieldsService } from './employment-form-fields.service';
import { EmploymentFormField } from '../Schemas/employment-form-field.schema';

@Controller('employment-form-fields')
export class EmploymentFormFieldsController {
  constructor(private readonly service: EmploymentFormFieldsService) {}

  @Get()
  async getAll() {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Put()
async replaceAll(@Body() fields: EmploymentFormField[]) {
  return this.service.replaceAll(fields);
}



  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() field: EmploymentFormField) {
    return this.service.create(field);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteAll() {
    return this.service.deleteAll();
  }
}
