import 'dotenv/config';
import { PrismaClient, Prisma } from '../../generated/prisma/client.js';

const prisma = new PrismaClient();

async function main() {
    await prisma.team.deleteMany();
    await prisma.pokemonDetails.deleteMany();
    await prisma.pokemon.deleteMany();

  const pokemons = [
    {
      name: 'bulbasaur',
      sprites: { front_default: 'https://pokeapi.co/sprites/bulbasaur.png' },
      types: [{ slot: 1, type: { name: 'grass' } }, { slot: 2, type: { name: 'poison' } }],
    },
    {
      name: 'charmander',
      sprites: { front_default: 'https://pokeapi.co/sprites/charmander.png' },
      types: [{ slot: 1, type: { name: 'fire' } }],
    },
    {
      name: 'squirtle',
      sprites: { front_default: 'https://pokeapi.co/sprites/squirtle.png' },
      types: [{ slot: 1, type: { name: 'water' } }],
    },
  ];

  await prisma.pokemon.createMany({
    data: pokemons.map((p) => ({
      name: p.name,
      sprites: p.sprites,
      types: p.types,
    })),
    skipDuplicates: true,
  });


  const saved = await prisma.pokemon.findMany({
    where: { name: { in: pokemons.map((p) => p.name) } },
  });

  if (saved[0]) {
    await prisma.pokemonDetails.upsert({
      where: { id: saved[0].id },
      update: {
        height: 7,
        weight: 69,
        moves: [],
        order: 1,
        species: 'bulbasaur-species',
        stats: [],
        abilities: [],
        form: 'normal',
        sprites: saved[0].sprites as unknown as Prisma.InputJsonValue,
        types: saved[0].types as unknown as Prisma.InputJsonValue,
        name: saved[0].name,
      },
      create: {
        id: saved[0].id,
        name: saved[0].name,
        sprites: saved[0].sprites as unknown as Prisma.InputJsonValue,
        types: saved[0].types as unknown as Prisma.InputJsonValue,
        height: 7,
        weight: 69,
        moves: [],
        order: 1,
        species: 'bulbasaur-species',
        stats: [],
        abilities: [],
        form: 'normal',
      },
    });
  }

  console.log('Seed finished');
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });