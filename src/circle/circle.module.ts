import { Module } from '@nestjs/common';
import { CircleService } from './circle.service';
import { CircleController } from './circle.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [CircleService, PrismaService],
  controllers: [CircleController]
})
export class CircleModule {
  
}
