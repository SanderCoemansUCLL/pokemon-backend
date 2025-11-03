-- CreateTable
CREATE TABLE "Pokemon" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "sprites" JSONB NOT NULL,
    "types" JSONB NOT NULL,

    CONSTRAINT "Pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonDetails" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "sprites" JSONB NOT NULL,
    "types" JSONB NOT NULL,
    "height" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "moves" JSONB NOT NULL,
    "order" INTEGER NOT NULL,
    "species" TEXT NOT NULL,
    "stats" JSONB NOT NULL,
    "abilities" JSONB NOT NULL,
    "form" TEXT NOT NULL,

    CONSTRAINT "PokemonDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PokemonToTeam" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PokemonToTeam_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pokemon_name_key" ON "Pokemon"("name");

-- CreateIndex
CREATE INDEX "_PokemonToTeam_B_index" ON "_PokemonToTeam"("B");

-- AddForeignKey
ALTER TABLE "_PokemonToTeam" ADD CONSTRAINT "_PokemonToTeam_A_fkey" FOREIGN KEY ("A") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonToTeam" ADD CONSTRAINT "_PokemonToTeam_B_fkey" FOREIGN KEY ("B") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
