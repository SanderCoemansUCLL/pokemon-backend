
import { Module } from '@nestjs/common';
import { PokemonModule } from './pokemon/pokemon.module.js';
import { TeamModule } from './team/team.module.js';

@Module({
  imports: [PokemonModule, TeamModule],
})
export class AppModule {}
