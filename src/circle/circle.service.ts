import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { uuid } from 'uuidv4';

@Injectable()
export class CircleService {
    constructor(private prismaService : PrismaService){}

    async updateCircle(broadcastId:string,longitude:number,latitude:number,distance:number): Promise<any>{
        const newdata : Array<any> = await this.prismaService.$queryRaw`
        SELECT user_id 
        FROM "User" 
        WHERE ST_Distance(
            ST_SetSRID(ST_MakePoint("location"[0]::double precision, "location"[1]::double precision), 4326)::geography,
            ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography
        ) <= distance
    `;
        for (let i = 0; i < newdata.length; i++) {
        const circleId = uuid()
        const receiverId = newdata[i].user_id
         await this.prismaService.$queryRaw`INSERT INTO "Circle" ("circle_id","broadcast_id","receiver_id", "created_at", "is_expired") VALUES ( ${circleId}, ${broadcastId},${receiverId},Now(),false)`;
    
    }
}
async getBroadcastByUserId(userId:string):Promise<any>{
    const rawData: Array<any> = await this.prismaService.$queryRaw`
    SELECT b_location::text, "Broadcast".broadcast_id, receiver_id, text, sender_id
    FROM "Broadcast" 
    INNER JOIN "Circle" ON "Circle"."broadcast_id" = "Broadcast"."broadcast_id"
`;

const processedData = rawData.map((data) => {
    const [, longitude, latitude] = data.b_location.match(/\(([^,]+),([^)]+)\)/) || [];
    return {
        broadcast_id: data.broadcast_id,
        receiver_id: data.receiver_id,
        text: data.text,
        sender_id: data.sender_id,
        longitude: parseFloat(longitude),
        latitude: parseFloat(latitude)
    };
});
    return processedData
}
}
