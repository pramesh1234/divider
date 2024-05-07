import { Body, Controller, Get, Post,Request, UseGuards } from '@nestjs/common';
import { CircleService } from './circle.service';
import { BroadcastByIdDto } from './dto/broadcast.by.id.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('circle')
export class CircleController {

    constructor(private circleService : CircleService){}
    @UseGuards(AuthGuard)
    @Get('/getBroadcastByUserId')
    async getBroadCastByUserId(@Request() req){
        const data = await this.circleService.getBroadcastByUserId(req.userId)
           return {
            data:data,
              message: "Data fetched successfully",
            };
    }
}
