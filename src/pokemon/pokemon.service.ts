import { BadRequestException, Injectable } from '@nestjs/common';
import { Pokemon } from 'generated/prisma/client.js';
import { PrismaService } from '../prisma.service.js';
import { PokemonType } from '../types/index.js';
import * as fs from 'fs';
import path from 'path';
import axios from 'axios';

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

  async getPokemonsPaginated(
    sort?: 'name-asc' | 'name-desc' | 'id-asc' | 'id-desc',
    limit?: number,
    offset?: number,
  ): Promise<Pokemon[]> {

    const orderBy = sort
      ? { [sort.split('-')[0]]: sort.split('-')[1] }
      : undefined;

    let take: number | undefined = undefined;
    let skip: number | undefined = undefined;

    if (limit) {
      take = Number(limit);
    }
    if (offset) {
      skip = Number(offset);
    }
    return await this.prisma.pokemon.findMany({
      orderBy,
      take,
      skip,
    });
  }

  async importPokemon(identifier: string): Promise<Pokemon> {
    if (!identifier) {
      throw new BadRequestException('Identifier is required to import a Pokémon.');
    }

    const apiPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${identifier}`);
    if (!apiPokemon.ok) {
      throw new BadRequestException('Pokémon not found in external API.');
    }

    const pokemonData = await apiPokemon.json();

    if (await this.pokemonExists(pokemonData.id)) {
      throw new BadRequestException('Pokémon already exists in the database.');
    }

    await this.prisma.pokemonDetails.create({
      data: {
        id: pokemonData.id,
        name: pokemonData.name,
        sprites: pokemonData.sprites,
        types: pokemonData.types,
        height: pokemonData.height,
        weight: pokemonData.weight,
        moves: pokemonData.moves,
        order: pokemonData.order,
        species: pokemonData.species.name,
        stats: pokemonData.stats,
        abilities: pokemonData.abilities,
        form: pokemonData.forms[0]?.name || pokemonData.name,
      },
    });

    return await this.prisma.pokemon.create({
      data: {
        id: pokemonData.id,
        name: pokemonData.name,
        sprites: pokemonData.sprites,
        types: pokemonData.types,
      },
    });
  }

  async pokemonExists(id: number): Promise<boolean> {
    const pokemon = await this.prisma.pokemon.findUnique({
      where: { id },
    });

    const pokemonDetails = await this.prisma.pokemonDetails.findUnique({
      where: { id },
    });
    return !!pokemon && !!pokemonDetails;
  }

  async downloadPokemonImage(identifier: string): Promise<void> {
    const apiPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${identifier}`);
    if (!apiPokemon.ok) {
      throw new BadRequestException('Pokémon not found in external API.');
    }

    const pokemonData = await apiPokemon.json();
    const imageUrl = pokemonData.sprites.front_default;

    if (!imageUrl) {
      throw new BadRequestException('No image available for this Pokémon.');
    }

    const directory = path.join(process.cwd(), 'downloaded-images');

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }

    const filepath = path.join(directory, `${identifier}.png`);

    const response = await axios({
    url: imageUrl,
    method: 'GET',
    responseType: 'stream',
  })
  return new Promise<void>((resolve, reject) => {
    response.data
      .pipe(fs.createWriteStream(filepath))
      .on('error', reject)
      .once('close', () => resolve())
  })

  }
}
