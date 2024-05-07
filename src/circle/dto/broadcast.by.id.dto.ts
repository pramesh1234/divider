import { IsNotEmpty, IsString } from "class-validator"

export class BroadcastByIdDto{
    @IsNotEmpty()
    @IsString()
    userId:string;
}