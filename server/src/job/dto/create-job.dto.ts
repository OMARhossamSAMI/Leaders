export class CreateJobDto {
  title: string;
  careerLevel: string;
  employmentType: string;
  academicYear: '25/26' | '26/27'; // restrict to two options
  startYear: number;
  endYear: number;
}
