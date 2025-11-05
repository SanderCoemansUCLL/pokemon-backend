import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { PokemonService } from '../pokemon/pokemon.service.js';
import { Pokemon } from '../../generated/prisma/client.js';

@Controller()
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get('/api/v1/pokemons')
  async getAllPokemons(
    @Query('sort') sort?: 'name-asc' | 'name-desc' | 'id-asc' | 'id-desc',
  ): Promise<Pokemon[]> {
    return await this.pokemonService.getAllPokemons(sort);
  }

  @Get('/api/v1/pokemons/:id')
  async getPokemonById(@Param('id', ParseIntPipe) id: number) {
    return await this.pokemonService.getPokemonById(id);
  }

  @Get('/api/v1/search')
  async searchPokemons(@Query('query') query: string, @Query('limit') limit?: number): Promise<Pokemon[]> {
    return await this.pokemonService.searchPokemons(query, limit);
  }

  @Get('/api/v2/pokemons')
  async getPokemonsPaginated(@Query('sort') sort?: 'name-asc' | 'name-desc' | 'id-asc' | 'id-desc',
  @Query('limit') limit?: number, @Query('offset') offset?: number) {
    return await this.pokemonService.getPokemonsPaginated(sort, limit, offset);
  }
}