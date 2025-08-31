import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { StudentApplicationService } from './student-application.service';
import { MongoIdPipe } from '../common/pipes/mongo-id.pipe';

// Type for the two-week scheduling window we return to the client
type ScheduleWindow = { startISO: string; endISO: string };

@Controller('applications')
export class StudentApplicationController {
  constructor(private readonly appService: StudentApplicationService) {}

  // POST /applications
  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async submitApplication(
    @Body() body: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.appService.submitApplication(body, files);
  }

  // GET /applications
  @Get()
  async getAllApplications() {
    return this.appService.getAllApplications();
  }

  // ✅ static route BEFORE any :id routes
  // GET /applications/by-parent-email?email=...
  @Get('by-parent-email')
  async byParentEmail(@Query('email') email?: string) {
    const clean = (email ?? '').trim();
    if (!clean) throw new BadRequestException('email is required');

    const app = await this.appService.findByParentEmail(clean);
    if (!app) return { application: null, window: null };

    // Normalize the submission timestamp (prefer submittedAt; fallback to createdAt)
    const submittedAtRaw: any =
      (app as any).submittedAt ?? (app as any).createdAt;
    const submittedAtDate = submittedAtRaw ? new Date(submittedAtRaw) : null;

    // Compute a two-week window (typed to avoid TS2322)
    let scheduleWindow: ScheduleWindow | null = null;
    if (submittedAtDate && !Number.isNaN(submittedAtDate.getTime())) {
      const start = new Date(submittedAtDate);
      const end = new Date(submittedAtDate);
      end.setDate(end.getDate() + 14);
      scheduleWindow = {
        startISO: start.toISOString(),
        endISO: end.toISOString(),
      };
    }

    // Ensure we always send a serializable submittedAt
    const application = {
      ...app,
      submittedAt: submittedAtDate ? submittedAtDate.toISOString() : null,
    };

    return { application, window: scheduleWindow };
  }

  // GET /applications/unbooked?unpaid=1
  @Get('unbooked')
  async listUnbooked(@Query('unpaid') unpaid?: string) {
    const unpaidOnly = unpaid === '1' || unpaid === 'true';
    return this.appService.listUnbookedOrUnpaid({ unpaidOnly });
  }

  // DELETE /applications/:id
  @Delete(':id')
  async deleteApplication(@Param('id', MongoIdPipe) id: string) {
    return this.appService.deleteApplication(id);
  }

  // PATCH /applications/:id
  @Patch(':id')
  async updateApplication(
    @Param('id', MongoIdPipe) id: string,
    @Body() body: any,
  ) {
    return this.appService.updateApplication(id, body);
  }

  // GET /applications/:id
  @Get(':id')
  async getApplicationById(@Param('id', MongoIdPipe) id: string) {
    return this.appService.getApplicationById(id);
  }
  // GET /applications/by-id/:id
  @Get('by-id/:id')
  async byId(@Param('id', MongoIdPipe) id: string) {
    const app = await this.appService.findByIdLean(id);
    if (!app) return { application: null, window: null };

    // Always compute scheduling window from today
    const today = new Date();
    const start = new Date(today);
    const end = new Date(today);
    end.setDate(end.getDate() + 14);

    const scheduleWindow = {
      startISO: start.toISOString(),
      endISO: end.toISOString(),
    };

    return {
      application: {
        ...app,
        submittedAt: app.submittedAt ?? today.toISOString(), // keep field for compatibility
      },
      window: scheduleWindow,
    };
  }
}
