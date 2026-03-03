import { IsString, IsEnum, IsOptional, IsNumber, IsArray, IsInt, Min, Max } from "class-validator";

export enum ResourceType { PDF = "PDF", AUDIO = "AUDIO", VIDEO = "VIDEO", DOCUMENT = "DOCUMENT" }

export class CreateResourceDto {
  @IsString() title!: string;
  @IsOptional() @IsString() description?: string;
  @IsEnum(ResourceType) type!: ResourceType;
  @IsString() url!: string;
  @IsOptional() @IsNumber() fileSize?: number;
  @IsOptional() @IsNumber() duration?: number;
  @IsOptional() @IsNumber() order?: number;
  @IsOptional() @IsString() moduleId?: string;
}

export class CreateQuizDto {
  @IsString() title!: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsInt() @Min(0) @Max(100) passingScore?: number;
}

export class CreateQuestionDto {
  @IsString() question!: string;
  @IsArray() options!: string[];
  @IsString() correctAnswer!: string;
  @IsOptional() @IsString() explanation?: string;
  @IsOptional() @IsInt() order?: number;
}

export class SubmitQuizDto {
  @IsArray() answers!: { questionId: string; answer: string }[];
}
