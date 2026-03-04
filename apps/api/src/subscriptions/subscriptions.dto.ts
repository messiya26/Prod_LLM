import { IsString, IsOptional, IsNumber, IsEnum } from "class-validator";

export class CreateSubscriptionDto {
  @IsString()
  plan!: string;

  @IsString()
  @IsOptional()
  interval?: string;

  @IsString()
  @IsOptional()
  method?: string;
}
