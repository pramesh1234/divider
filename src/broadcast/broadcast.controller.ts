import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { BroadCastDto } from './dto/broadcast.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('broadcast')
export class BroadcastController {
    @UseGuards(AuthGuard)
    @Get('/send')
    async sendBroadcast(@Body() Body:BroadCastDto){
    
    }
}
