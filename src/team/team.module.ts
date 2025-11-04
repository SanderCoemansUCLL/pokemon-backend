import { Module } from '@nestjs/common';
import { TeamController } from './team.controller.js';
import { TeamService } from './team.service.js';
import { PrismaService } from '../prisma.service.js';

@Module({
  controllers: [TeamController],
  providers: [TeamService, PrismaService],
})
export class TeamModule {}