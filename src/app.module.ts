
import { Module } from '@nestjs/common';
import { PokemonModule } from './pokemon/pokemon.module';
import { TeamModule } from './team/team.module';

@Module({
  imports: [PokemonModule, TeamModule],
})
export class AppModule {}
