import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  Delete,
  Get,
  Param,
  Patch,
  UploadedFiles,
  Header,
} from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { VacancyService } from './vacancy.service';

@Controller('vacancy')
export class VacancyController {
  constructor(private readonly vacancyService: VacancyService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @Body() body: Record<string, any>,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    // Convert files to key-value map
    const filesMap: Record<string, Express.Multer.File[]> = {};
    for (const file of files) {
      const field = file.fieldname;
      if (!filesMap[field]) filesMap[field] = [];
      filesMap[field].push(file);
    }

    return this.vacancyService.create(body, filesMap);
  }

  @Get()
  async findAll() {
    return this.vacancyService.findAll();
  }

  @Get('export')
@Header('Content-Type', 'text/csv')
@Header('Content-Disposition', 'attachment; filename="vacancy_applications.csv"')
async exportCSV(): Promise<string> {
  return this.vacancyService.exportCSV();
}


  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { data: Record<string, any> },
  ) {
    return this.vacancyService.update(id, body.data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.vacancyService.delete(id);
  }
}
