import { Injectable } from '@nestjs/common';
import { Pokemon } from 'generated/prisma/client.js';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class PokemonService {
  constructor(private prisma: PrismaService) {}

  async getAllPokemons(
    sort?: 'name-asc' | 'name-desc' | 'id-asc' | 'id-desc',
  ): Promise<Pokemon[]> {
    if (sort) {
      const [field, direction] = sort.split('-');
      return await this.prisma.pokemon.findMany({
        orderBy: { [field]: direction },
      });
    }

    return await this.prisma.pokemon.findMany();
  }

  async getPokemonById(id: number): Promise<Pokemon | null> {
    return await this.prisma.pokemonDetails.findUnique({
      where: { id: id },
    });
  }

  async searchPokemons(query: string, limit?: number): Promise<Pokemon[]> {
    type PokemonType = { slot: number; type: { name: string } };

    const pokemons = await this.prisma.pokemon.findMany();
    const filteredPokemons = pokemons.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        (p.types as PokemonType[]).some((t) =>
          t.type.name.toLowerCase().includes(query.toLowerCase()),
        ),
    );
    return limit ? filteredPokemons.slice(0, limit) : filteredPokemons;
  }  
}
