import { IsString, IsOptional, IsEnum, IsInt, Min, IsDateString } from "class-validator";

export enum LivePlatformDto { JITSI = "JITSI", ZOOM = "ZOOM", GOOGLE_MEET = "GOOGLE_MEET" }

export class CreateLiveSessionDto {
  @IsString() title!: string;
  @IsOptional() @IsString() description?: string;
  @IsEnum(LivePlatformDto) platform!: string;
  @IsDateString() scheduledAt!: string;
  @IsOptional() @IsString() courseId?: string;
  @IsOptional() @IsInt() @Min(1) maxAttendees?: number;
  @IsOptional() @IsString() meetingUrl?: string;
}

export class UpdateLiveSessionDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsEnum(LivePlatformDto) platform?: string;
  @IsOptional() @IsDateString() scheduledAt?: string;
  @IsOptional() @IsString() courseId?: string;
  @IsOptional() @IsInt() @Min(1) maxAttendees?: number;
  @IsOptional() @IsString() meetingUrl?: string;
  @IsOptional() @IsString() replayUrl?: string;
  @IsOptional() @IsString() status?: string;
}
