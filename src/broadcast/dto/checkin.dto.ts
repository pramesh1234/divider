import { IsBoolean, IsNotEmpty, IsString, isNotEmpty, isString } from "class-validator";

export class CheckInDto{
    @IsBoolean()
    checkIn :boolean;

   
    @IsString()
    @IsNotEmpty()
    broadcastId:string;
}