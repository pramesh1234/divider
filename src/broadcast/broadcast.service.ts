import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { BroadCastDto } from './dto/broadcast.dto';
import { uuid } from 'uuidv4';
import { CircleService } from 'src/circle/circle.service';
import { User } from 'prisma/generated/client';
import { AnyARecord } from 'dns';

@Injectable()
export class BroadcastService {
    constructor(private prismaService : PrismaService,private circleService:CircleService){}

    async sendBroadcast(senderUid:string, text:string,distance:number): Promise<any>{
        const broadcastId = uuid()
         var locationData : string
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
    
          const user:any = await prisma.$queryRaw`SELECT ST_AsText(location) as location FROM "User" Where "user_id" = ${senderUid}`;      
          const sUid = senderUid
         
          locationData = `SRID=4326;${user[0].location}`
           await prisma.$queryRaw`INSERT INTO "Broadcast" ("broadcast_id","sender_id", "text", "b_location","created_at") VALUES ( ${broadcastPoint.broadcastId}:: uuid,${broadcastPoint.senderUid}, ${broadcastPoint.broadcast},ST_GeogFromText(${locationData}),Now())`;
           console.log(`dual data ${user[0].location}`)
  
                
        }}}})
        const data = {
            broadcastId,
            senderUid,
            broadcast :text}
          await prisma.user.create(data);
          this.circleService.updateCircle(broadcastId,locationData,distance)
        return data
}

}
