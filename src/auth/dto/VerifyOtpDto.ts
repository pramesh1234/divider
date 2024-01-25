import { IsNotEmpty, IsString } from "class-validator";

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsString()
  otp: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
  @IsNotEmpty()
  @IsString()
  countryCode: string;
}
