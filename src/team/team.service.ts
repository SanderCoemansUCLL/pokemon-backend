import { BadRequestException, Injectable } from '@nestjs/common';
import { Team, Prisma } from 'generated/prisma/client.js';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class TeamService {
  constructor(private prisma: PrismaService) {}

  async getAllTeams(): Promise<Team[]> {
    return await this.prisma.team.findMany(
      { include: { pokemons: true } }
    );
  }

  async getTeamById(id: number): Promise<Team | null> {
    return await this.prisma.team.findUnique({
      where: { id: id },
      include: { pokemons: true },
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
      throw new BadRequestException('A team cannot have more than 6 Pokémons.');
    }
    return await this.prisma.team.create({
      data: teamData,
      include: { pokemons: true },
    });
  }

  async deleteTeam(id: number): Promise<Team> {
    return await this.prisma.team.delete({
      where: { id: id },
    });
  }

  async addPokemonToTeam(teamId: number, pokemonId: number): Promise<Team> {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      include: { pokemons: true },
    });

    if (team && team.pokemons.length >= 6) {
      throw new BadRequestException('A team cannot have more than 6 Pokémons.');
    } else if (team && team.pokemons.some(p => p.id === pokemonId)) {
      throw new BadRequestException('This Pokémon is already in the team.');
    }

    return await this.prisma.team.update({
      where: { id: teamId },
      data: {
        pokemons: {
          connect: { id: pokemonId },
        },
      },
      include: { pokemons: true },
    });
  }

  async removePokemonFromTeam(teamId: number, pokemonId: number): Promise<Team> {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      include: { pokemons: true },
    });

    if (team && !team.pokemons.some(p => p.id === pokemonId)) {
      throw new BadRequestException('This Pokémon is not in the team.');
    }

    return await this.prisma.team.update({
      where: { id: teamId },
      data: {
        pokemons: {
          disconnect: { id: pokemonId },
        },
      },
      include: { pokemons: true },
    });
  }
}
