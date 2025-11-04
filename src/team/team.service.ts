import { Injectable } from '@nestjs/common';
import { Team, Prisma } from 'generated/prisma/client.js';
import { PrismaService } from '../prisma.service.js';

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

  async createTeam(teamData: Prisma.TeamCreateInput): Promise<Team> {
    
    let pokemonCount = 0;
    const connect = teamData.pokemons?.connect;
    if (Array.isArray(connect)) {
      pokemonCount = connect.length;
    } else if (connect) {
      pokemonCount = 1;
    }

    if (pokemonCount > 6) {
      throw new Error('A team cannot have more than 6 Pokémons.');
    }
    return await this.prisma.team.create({
      data: teamData,
      include: { pokemons: true },
    });
  }
}
