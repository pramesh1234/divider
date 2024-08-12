import { Module } from "@nestjs/common";
import { BroadcastController } from "./broadcast.controller";
import { BroadcastService } from "./broadcast.service";
import { PrismaService } from "src/prisma.service";
import { CircleService } from "src/circle/circle.service";

@Module({
  controllers: [BroadcastController],
  providers: [BroadcastService, PrismaService, CircleService],
  exports: [BroadcastService, PrismaService],
})
export class BroadcastModule {}
