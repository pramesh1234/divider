import { IsNotEmpty, IsString } from "class-validator";

export class NumberValidationDto {
  @IsNotEmpty()
  @IsString()
  countryCode: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}
