import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { PokemonService } from '../pokemon/pokemon.service.js';
import { Pokemon } from '../../generated/prisma/client.js';

@Controller()
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get('/api/v1/pokemons')
  async getAllPokemons(
    @Query('sort', ValidationPipe) sort?: 'name-asc' | 'name-desc' | 'id-asc' | 'id-desc',
  ): Promise<Pokemon[]> {
    return await this.pokemonService.getAllPokemons(sort);
  }

  @Get('/api/v1/pokemons/:id')
  async getPokemonById(@Param('id', ParseIntPipe) id: number) {
    return await this.pokemonService.getPokemonById(id);
  }
}