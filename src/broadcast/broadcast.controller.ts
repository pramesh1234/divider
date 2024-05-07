import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { BroadCastDto } from './dto/broadcast.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { BroadcastService } from './broadcast.service';

@Controller('broadcast')
export class BroadcastController {

    constructor(private broadcastService : BroadcastService){

    }
    @UseGuards(AuthGuard)
    @Post('/send')
    async sendBroadcast(@Body() body:BroadCastDto, @Request() req){

    const text = body.broadcast
    const senderUid = req?.user.userId

    const broadcastedData = await this.broadcastService.sendBroadcast(senderUid,text)
    if(broadcastedData!=null){
        return {
          data:broadcastedData,
            message: "Broadcast sent successfully",
          };
        } else{
            return {
                message: "Something went wrong",
              };
    }

    }
}
