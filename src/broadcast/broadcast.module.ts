import { Module } from '@nestjs/common';
import { BroadcastController } from './broadcast.controller';
import { BroadcastService } from './broadcast.service';
import { CircleService } from 'src/circle/circle.service';

@Module({
    controllers: [BroadcastController],
    providers: [BroadcastService,CircleService],
    exports: [BroadcastService],

})
export class BroadcastModule {}
