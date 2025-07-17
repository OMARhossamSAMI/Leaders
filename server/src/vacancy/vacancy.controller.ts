import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { VacancyService } from './vacancy.service';

@Controller('vacancy')
export class VacancyController {
  constructor(private readonly vacancyService: VacancyService) {}

  @Post()
create(@Body() body: any) {
  return this.vacancyService.create({ data: body });
}

@Get()
async findAll() {
  return this.vacancyService.findAll();
}

@Patch(':id')
async update(@Param('id') id: string, @Body() body: { data: Record<string, any> }) {
  return this.vacancyService.update(id, body.data);
}

@Delete(':id')
async delete(@Param('id') id: string) {
  return this.vacancyService.delete(id);
}

}
