import 'dotenv/config'
import { PrismaClient } from '../../generated/prisma/client.js';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

type PokemonJsonData = {
  id: number;
  name: string;
  sprites: any;
  types: any;
  height: number;
  weight: number;
  moves: any;
  order: number;
  species: {
    name: string;
  };
  stats: any;
  abilities: any;
  forms: {
    name: string;
  }[];
};

async function importData() {

    await prisma.pokemonDetails.deleteMany();
    await prisma.pokemon.deleteMany();

    const filePath = 'src/utils/pokemons.json';
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const pokemons: PokemonJsonData[] = JSON.parse(fileContent);

    const pokemonData = pokemons.map((p) => ({
        id: p.id,
        name: p.name,
        sprites: p.sprites,
        types: p.types,
    }));

    const pokemonDetailsData = pokemons.map((p) => ({
        id: p.id,
        name: p.name,
        sprites: p.sprites,
        types: p.types,
        height: p.height,
        weight: p.weight,
        moves: p.moves,
        order: p.order,
        species: p.species.name,
        stats: p.stats,
        abilities: p.abilities,
        form: p.forms[0]?.name || p.name,
    }));

    await prisma.pokemon.createMany({
        data: pokemonData,
        skipDuplicates: true,
    });

    await prisma.pokemonDetails.createMany({
        data: pokemonDetailsData,
        skipDuplicates: true,
    });
}

importData().finally(async () => {
    await prisma.$disconnect();
});
