import { IsString, IsOptional, IsEnum, IsNumber, IsBoolean } from "class-validator";

export class CreateCourseDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsEnum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL_LEVELS"])
  level?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsString()
  categoryId!: string;

  @IsOptional()
  @IsString()
  instructorId?: string;
}

export class UpdateCourseDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsEnum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL_LEVELS"])
  level?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  instructorId?: string;
}
