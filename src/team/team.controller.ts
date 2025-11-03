import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { TeamService } from '../team/team.service';
import { Team } from 'generated/prisma/client';

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
}