import { Injectable } from '@nestjs/common';
import { Prisma } from 'prisma/generated/client';
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
async getBroadcastByUserId(userId: string): Promise<any> {
    try {
        // Get the user's location
        const coorOfUser = await this.prismaService.$queryRaw`
            SELECT ST_AsText(location) as location_string 
            FROM "User" 
            WHERE "user_id" = ${userId}
        `;
        
        // if (coorOfUser.length === 0) {
        //     throw new Error('User location not found');
        // }

        // Get broadcasts for the user
        const rawData: Array<any> = await this.prismaService.$queryRaw`
            SELECT 
                ST_AsText(b_location) as b_location_string, 
                "Broadcast".broadcast_id, 
                "Broadcast".created_at, 
                receiver_id, 
                text, 
                sender_id, 
                COALESCE("CheckIn".is_checked_in, false) AS is_checked_in
            FROM 
                "Broadcast" 
            INNER JOIN 
                "Circle" ON "Circle"."broadcast_id" = "Broadcast"."broadcast_id" 
            LEFT JOIN 
                "CheckIn" ON "CheckIn"."broadcast_id" = "Broadcast"."broadcast_id" 
            WHERE 
                receiver_id = ${userId}
        `;

        if (rawData.length === 0) {
            return []; // Return early if no broadcasts are found
        }

        // Extract all unique sender IDs
        const senderIds = [...new Set(rawData.map(data => data.sender_id))];

        // Fetch user details for all sender IDs in bulk
        const userDetails: Array<any> = await this.prismaService.$queryRaw`
            SELECT user_id, first_name, last_name, user_name 
            FROM "User" 
            WHERE user_id IN (${Prisma.join(senderIds)})
        `;

        // Create a map of user details keyed by user_id
        const userDetailMap = userDetails.reduce((map, user) => {
            map[user.user_id] = user;
            return map;
        }, {});

        // Process the data
        const processedData = await Promise.all(
            rawData.map(async (data) => {
                const [longitude, latitude] = data.b_location_string
                    .replace("POINT(", "")
                    .replace(")", "")
                    .split(" ");

                // Calculate distance
                const dis = await this.prismaService.$queryRaw`
                    SELECT ST_Distance(
                        ST_GeogFromText(${Prisma.raw(`'SRID=4326;${data.b_location_string}'`)}),
                        ST_GeogFromText(${Prisma.raw(`'SRID=4326;${coorOfUser[0].location_string}'`)})
                    ) AS distance_meters;
                `;

                // Get the user detail from the map
                const userDetail = userDetailMap[data.sender_id];

                return {
                    broadcast_id: data.broadcast_id,
                    receiver_id: data.receiver_id,
                    text: data.text,
                    createdAt: data.created_at,
                    sender_id: data.sender_id,
                    longitude: parseFloat(longitude),
                    latitude: parseFloat(latitude),
                    user: userDetail,
                    distance: `${(dis[0].distance_meters / 1000).toFixed(1)} km`,
                    isCheckedIn: !!data.is_checked_in
                };
            })
        );

        return processedData;
    } catch (error) {
        console.error('Error fetching broadcasts by user ID:', error);
        throw new Error('Could not fetch broadcasts');
    }
}

}
