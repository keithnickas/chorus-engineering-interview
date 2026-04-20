import {  IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, Min, MinLength } from 'class-validator';
import { UUID } from 'node:crypto';

export class CreateProfileDto {
  @IsOptional()
  @IsUUID()
  uid!: UUID;

  @IsString()
  @MinLength(3)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;
}
