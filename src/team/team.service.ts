import { Injectable } from '@nestjs/common';
import { Team } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TeamService {
  constructor(private prisma: PrismaService) {}

  async getAllTeams(): Promise<Team[]> {
    return await this.prisma.team.findMany();
  }

  async getTeamById(id: number): Promise<Team | null> {
    return await this.prisma.team.findUnique({
      where: { id: id }
    });
  }
}
