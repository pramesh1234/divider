import { IsNotEmpty, IsString } from "class-validator";

export class BroadCastDto{
    @IsString()
    @IsNotEmpty()
    broadcast : string;
    
    @IsString()
    @IsNotEmpty()
    longitude : string;

    @IsString()
    @IsNotEmpty()
    latitude : string;
}