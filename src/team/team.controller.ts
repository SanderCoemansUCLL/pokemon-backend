import {
    Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { TeamService } from '../team/team.service.js';
import { Team, Prisma } from '../../generated/prisma/client.js';

@Controller()
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get('/api/v1/teams')
  async getAllTeams(): Promise<Team[]> {
    return await this.teamService.getAllTeams();
  }

  @Get('/api/v1/teams/:id')
  async getTeamById(@Param('id', ParseIntPipe) id: number) {
    return await this.teamService.getTeamById(id);
  }

  @Post('/api/v1/teams')
  async createTeam(@Body() teamData: Prisma.TeamCreateInput): Promise<Team> {
    return await this.teamService.createTeam(teamData);
  }

  @Delete('/api/v1/teams/:id')
  async deleteTeam(@Param('id', ParseIntPipe) id: number): Promise<Team> {
    return await this.teamService.deleteTeam(id);
  }

  @Put('/api/v1/teams/add')
  async addPokemonToTeam(
    @Body('teamId', ParseIntPipe) teamId: number,
    @Body('pokemonId', ParseIntPipe) pokemonId: number,
  ): Promise<Team> {
    return await this.teamService.addPokemonToTeam(teamId, pokemonId);
  }

  @Put('/api/v1/teams/remove')
  async removePokemonFromTeam(
    @Body('teamId', ParseIntPipe) teamId: number,
    @Body('pokemonId', ParseIntPipe) pokemonId: number,
  ): Promise<Team> {
    return await this.teamService.removePokemonFromTeam(teamId, pokemonId);
  }
}