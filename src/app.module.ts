import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { ConfigModule } from "@nestjs/config";
import { PrismaService } from "./prisma.service";
import { CacheModule } from "@nestjs/cache-manager";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./auth/constants";
import { BroadcastController } from './broadcast/broadcast.controller';
import { BroadcastService } from './broadcast/broadcast.service';
import { BroadcastModule } from './broadcast/broadcast.module';
import { CircleModule } from './circle/circle.module';
import { CircleController } from "./circle/circle.controller";
import { CircleService } from "./circle/circle.service";

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register(),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "15d" },
    }),
    BroadcastModule,
    CircleModule,
  ],
  controllers: [AppController, AuthController, CircleController],
  providers: [AppService, AuthService, PrismaService,CircleService],
})
export class AppModule {}
