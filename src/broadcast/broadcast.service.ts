import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { BroadCastDto } from './dto/broadcast.dto';
import { uuid } from 'uuidv4';
import { CircleService } from 'src/circle/circle.service';

@Injectable()
export class BroadcastService {
    constructor(private prismaService : PrismaService,private circleService:CircleService){}

    async sendBroadcast(senderUid:string, text:string): Promise<any>{
        const broadcastId = uuid()
        var xLongitude:number
        var yLatitude:number
        const prisma = this.prismaService.$extends({
            model: {
              user: {
                async create(data:{
                  broadcastId: string
                  broadcast: string
                  senderUid: string
    
                }){
          const broadcastPoint: BroadcastPoint = {
            broadcastId:data.broadcastId,
            broadcast: data.broadcast,
            senderUid:  data.senderUid,
          }
    
          const user:any = await prisma.$queryRaw`SELECT location::text FROM "User" Where "user_id" = ${senderUid}`;
          const match = user[0].location.match(/\(([^,]+),([^)]+)\)/);
          const sUid = user[0].userId
           xLongitude = parseFloat(match[1]);
           yLatitude = parseFloat(match[2]);
         await prisma.$queryRaw`INSERT INTO "Broadcast" ("broadcast_id","sender_id", "text", "b_location","created_at") VALUES ( ${broadcastPoint.broadcastId}:: uuid,${broadcastPoint.senderUid}, ${broadcastPoint.broadcast},ST_SetSRID(ST_MakePoint(${xLongitude}, ${yLatitude}), 4326)::point,Now())`;
                
        }}}})
        const data ={
            broadcastId,
            senderUid,
            broadcast :text}
          await prisma.user.create(data);
          this.circleService.updateCircle(broadcastId,xLongitude,yLatitude)
        return data
}

}
