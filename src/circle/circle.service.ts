import { Injectable } from '@nestjs/common';
import { stringify } from 'querystring';
import { PrismaService } from 'src/prisma.service';
import { uuid } from 'uuidv4';

@Injectable()
export class CircleService {
    constructor(private prismaService : PrismaService){}

    async updateCircle(broadcastId:string,point:string,distance:number,senderUid:string): Promise<any>{
    
        const newdata : Array<any> = await this.prismaService.$queryRaw`
        SELECT user_id 
        FROM "User" 
        WHERE ST_Distance(
            "location",
            ST_GeogFromText(${point})
        ) <= ${distance}
    `;

let filteredUsers = newdata.filter(user => user.user_id !== senderUid);
     console.log(`data users ${JSON.stringify(filteredUsers)}`)
        for (let i = 0; i < filteredUsers.length; i++) {
        const circleId = uuid()
        const receiverId = filteredUsers[i].user_id
         await this.prismaService.$queryRaw`INSERT INTO "Circle" ("circle_id","broadcast_id","receiver_id", "created_at", "is_expired") VALUES ( ${circleId}, ${broadcastId},${receiverId},Now(),false)`;
    
    }
}
async getBroadcastByUserId(userId:string):Promise<any>{
    console.log(`data broadcast userId ${userId}}`)
    const rawData: Array<any> = await this.prismaService.$queryRaw`
    SELECT ST_AsText(b_location) as b_location_string, "Broadcast".broadcast_id, receiver_id, text, sender_id
    FROM "Broadcast" 
    INNER JOIN "Circle" ON "Circle"."broadcast_id" = "Broadcast"."broadcast_id" where receiver_id = ${userId}
`;
const coorOfUser = await this.prismaService.$queryRaw`SELECT location from  "User" Where "user_id" = ${userId}`
const dis1 = 'SRID=4326;${b_location_string}'
const dis =  await this.prismaService.$queryRaw`SELECT
    ST_Distance(
        ST_GeogFromText(dis1),
        ST_GeogFromText('SRID=4326;POINT(77.391029 28.535517)')
    ) AS distance_meters;`
    console.log(`data broadcast userId ${JSON.stringify(coorOfUser)}}`)
const processedData = rawData.map((data) => {
    const coordinates = data.b_location_string
    .replace("POINT(", "")
    .replace(")", "")
    .split(" ");
    console.log(`coordinaates : : ${coordinates}  ${JSON.stringify(dis)}`); 
    const [longitude, latitude]  = coordinates

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
