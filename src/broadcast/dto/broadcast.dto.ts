import { IsNotEmpty, IsString } from "class-validator";

export class BroadCastDto{
    @IsString()
    @IsNotEmpty()
    broadcast : string;
}