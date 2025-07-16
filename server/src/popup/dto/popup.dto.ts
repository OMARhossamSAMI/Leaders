import {
  IsString,
  IsIn,
  IsOptional,
  IsArray,
  ArrayMaxSize,
} from 'class-validator';

export class CreatePopupDto {
  @IsString()
  title: string;

  @IsString()
  category: string;

  @IsString()
  message: string;

  @IsString()
  path: string;

  @IsIn(['on', 'off'])
  status: string;
}

export class UpdatePopupDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  path?: string[];

  @IsOptional()
  @IsIn(['on', 'off'])
  status?: string;
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(3)
  @IsString({ each: true })
  buttons?: string[];
}
