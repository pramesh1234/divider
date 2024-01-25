import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class BroadcastService {
    constructor(prismaService : PrismaService){}

    async sendBroadcast(){
        
    }
}
