import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { uuid } from "uuidv4";
import { CircleService } from "src/circle/circle.service";

@Injectable()
export class BroadcastService {
  constructor(
    private prismaService: PrismaService,
    private circleService: CircleService,
  ) {}

  async sendBroadcast(
    senderUid: string,
    text: string,
    distance: number,
    tag: string
  ): Promise<any> {
    const broadcastId = uuid();
    var locationData: string;
    const prisma = this.prismaService.$extends({
      model: {
        user: {
          async create(data: {
            broadcastId: string;
            broadcast: string;
            senderUid: string;
            tag: string;
          }) {
            const broadcastPoint: BroadcastPoint = {
              broadcastId: data.broadcastId,
              broadcast: data.broadcast,
              senderUid: data.senderUid,
              tag: data.tag
            };

            const user: any =
              await prisma.$queryRaw`SELECT ST_AsText(location) as location FROM "User" Where "user_id" = ${senderUid}`;

            locationData = `SRID=4326;${user[0].location}`;
            await prisma.$queryRaw`INSERT INTO "Broadcast" ("broadcast_id","sender_id","d_count","viewed_count", "text","tag" ,"b_location","created_at") VALUES ( ${broadcastPoint.broadcastId}:: uuid,${broadcastPoint.senderUid},0,0, ${broadcastPoint.broadcast},${broadcastPoint.tag},ST_GeogFromText(${locationData}),Now())`;
          },
        },
      },
    });
    const data = {
      broadcastId,
      senderUid,
      broadcast: text,
      tag
    };
    await prisma.user.create(data);
    this.circleService.updateCircle(broadcastId, locationData, distance);
    return data;
  }
}
