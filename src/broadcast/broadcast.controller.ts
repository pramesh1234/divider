import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { BroadCastDto } from './dto/broadcast.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { BroadcastService } from './broadcast.service';
import { CheckInDto } from './dto/checkin.dto';

@Controller('broadcast')
export class BroadcastController {

    constructor(private broadcastService : BroadcastService){

    }
    @UseGuards(AuthGuard)
    @Post('/send')
    async sendBroadcast(@Body() body:BroadCastDto, @Request() req){

    const text = body.broadcast
    const distance = body.distance
    const senderUid = req?.user.userId
    const tag = body.tag

    const broadcastedData = await this.broadcastService.sendBroadcast(senderUid,text,distance,tag)
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
    @UseGuards(AuthGuard)
    @Post('/checkin')
    async addCheckIn(@Body() body:CheckInDto, @Request() req){
    const checkedIn = await this.broadcastService.addCheckIn(req?.user.userId,body.checkIn,body.broadcastId)
    if(checkedIn){
      return{
        data:checkedIn,
        message: "Checked In Successfully"
      }
    }else{
      return{
        message: "Check In Failed"
      }
    }

    }
}
