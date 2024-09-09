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
    const rawData: Array<any> = await this.prismaService.$queryRaw`
    SELECT ST_AsText(b_location) as b_location_string, "Broadcast".broadcast_id, "Broadcast".created_at,receiver_id, text, sender_id, COALESCE("CheckIn".is_checked_in, false) AS is_checked_in
    FROM "Broadcast" 
    INNER JOIN "Circle" ON "Circle"."broadcast_id" = "Broadcast"."broadcast_id" LEFT JOIN 
    "CheckIn" ON "CheckIn"."broadcast_id" = "Broadcast"."broadcast_id" where receiver_id = ${userId}
`;
console.log("rawData: ", rawData)
const coorOfUser = await this.prismaService.$queryRaw`SELECT ST_AsText(location) as location_string from  "User" Where "user_id" = ${userId}`

    console.log(`data broadcast userId ${JSON.stringify(coorOfUser)}}`)
  
    const processedData = await Promise.all(
        rawData.map(async (data) => {
            const coordinates = data.b_location_string
                .replace("POINT(", "")
                .replace(")", "")
                .split(" ");
            const [longitude, latitude] = coordinates;
    
            const dis = await this.prismaService.$queryRaw`
                SELECT ST_Distance(
                    ST_GeogFromText(${`SRID=4326;${data.b_location_string}`}),
                    ST_GeogFromText(${`SRID=4326;${coorOfUser[0].location_string}`})
                ) AS distance_meters;
            `;
            const userDetail = await this.prismaService.$queryRaw`SELECT first_name, last_name, user_name, user_id from "User" WHERE user_id = ${data.sender_id}`
    
          console.log(`ddatatata : ${data}`)
    
            return {
                broadcast_id: data.broadcast_id,
                receiver_id: data.receiver_id,
                text: data.text,
                createdAt: data.created_at,
                sender_id: data.sender_id,
                longitude: parseFloat(longitude),
                latitude: parseFloat(latitude),
                user : userDetail[0],
                distance: `${(dis[0].distance_meters/1000).toFixed(1)} km`,
                isCheckedIn :!!data.is_checked_in
            };
        })
    );
    
    return processedData
}
}
