import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class BroadCastDto{
    @IsString()
    @IsNotEmpty()
    broadcast : string;

     @IsNumber()
     @IsNotEmpty()
     distance : number;
}