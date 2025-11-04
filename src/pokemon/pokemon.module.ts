import { Module } from '@nestjs/common';
import { PokemonController } from './pokemon.controller.js';
import { PokemonService } from './pokemon.service.js';
import { PrismaService } from '../prisma.service.js';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService, PrismaService],
})
export class PokemonModule {}
