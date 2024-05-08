import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log("Prisma client connected successfully");
    } catch (error) {
      this.logger.error("Error connecting to Prisma client", error.stack);
      throw error; // Rethrow the error to halt application initialization
    }
  }
}