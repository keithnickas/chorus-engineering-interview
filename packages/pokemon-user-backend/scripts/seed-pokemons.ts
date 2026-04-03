import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import pkg from 'pg';
import { randomUUID } from 'node:crypto';

const { Client } = pkg;

type PokemonYamlEntry = {
  pokemonid: string;
  national?: number;
  name?: string;
  gen?: number;
  formid?: string;
  formname?: string;
  release?: string;
  type1?: string;
  type2?: string;
  stats?: {
    hp: number;
    attack: number;
    defense: number;
    spattack: number;
    spdefense: number;
    speed: number;
  };
  species?: string;
  height?: number;
  weight?: number;
  gender?: string;
  catchRate?: number;
  baseExp?: number;
  eggCycles?: number;
  friendship?: number;
  growthRate?: string;
  evYield?: {
    hp?: number;
    attack?: number;
    defense?: number;
    spattack?: number;
    spdefense?: number;
    speed?: number;
  };
  spriteUrl?: string;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SEED_POKEMONS = path.resolve(
  __dirname,
  '..',
  'seed-data',
  'pokemons.yml'
);
const SEED_POKEMON_FORMS = path.resolve(
  __dirname,
  '..',
  'seed-data',
  'pokemon-forms.yml'
);

const SEED_PROFILES = path.resolve(
  __dirname,
  '..',
  'seed-data',
  'profiles.sql'
);

/**
 * This script is responsible for seeding the Pokémon and user profile data into the PostgreSQL database.
 * It reads Pokémon data from YAML files, processes it, and inserts it into the database using raw SQL queries.
 * The script also seeds user profile data from an SQL file. It handles database connections and transactions to ensure data integrity.
 * To run this script, ensure that the database connection parameters are set in the environment variables and execute the script with Node.js.
 */
function parseYamlFile(filePath: string) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = yaml.load(raw) as Record<string, PokemonYamlEntry> | undefined;

  if (!parsed) return [];
  return Object.entries(parsed).map(([key, entry]) => {
    const setUUID = randomUUID();
    return {
      pokemonid: entry?.pokemonid,
      uid: setUUID,
      name: (entry && entry.name) || key,
      national: entry?.national ?? null,
      gen: entry?.gen ?? null,
      formid: entry?.formid ?? null,
      formname: entry?.formname ?? null,
      release: entry?.release ?? null,
      type1: entry?.type1 ?? null,
      type2: entry?.type2 ?? null,
      stats: entry?.stats ?? null,
      species: entry?.species ?? null,
      height: entry?.height ?? null,
      weight: entry?.weight ?? null,
      gender: entry?.gender ?? null,
      catchRate: entry?.catchRate ?? null,
      baseExp: entry?.baseExp ?? null,
      eggCycles: entry?.eggCycles ?? null,
      friendship: entry?.friendship ?? null,
      growthRate: entry?.growthRate ?? null,
      evYield: entry?.evYield ?? null,
      spriteUrl: entry?.national
        ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${entry.national}.svg`
        : null,
    };
  });
}

/**
 * This script is responsible for seeding the Pokémon and user profile data into the PostgreSQL database.
 * It reads Pokémon data from YAML files, processes it, and inserts it into the database using raw SQL queries.
 * The script also seeds user profile data from an SQL file. It handles database connections and transactions to ensure data integrity.
 * To run this script, ensure that the database connection parameters are set in the environment variables and execute the script with Node.js.
 */
async function seed_pokemon_data() {
  if (!fs.existsSync(SEED_POKEMONS)) {
    console.error('Seed file not found at', SEED_POKEMONS);
    process.exit(1);
  }
  if (!fs.existsSync(SEED_POKEMON_FORMS)) {
    console.error('Seed file not found at', SEED_POKEMON_FORMS);
    process.exit(1);
  }

  const seed_pokemons = parseYamlFile(SEED_POKEMONS);
  const seed_pokemon_forms = parseYamlFile(SEED_POKEMON_FORMS);

  const rows = seed_pokemons.map(
    (pokemon: ReturnType<typeof parseYamlFile>[0]) => {
      const forms = seed_pokemon_forms.filter(
        (form) => form.pokemonid?.toLowerCase() === pokemon.name?.toLowerCase()
      );
      if (forms.length > 0) {
        return Object.assign({}, pokemon, ...Object.entries(forms[0]).filter(([, v]) => v !== null && v !== undefined).map(([k, v]) => ({ [k]: v })));
      }
      return pokemon;
    }
  );

  console.log(`Parsed entries: ${JSON.stringify(rows)}`);
  console.log(`Parsed ${rows.length} entries`);

  // Deduplicate by uid to avoid multiple VALUES for same unique key
  const dedupeMap = new Map<string, (typeof rows)[0]>();
  for (const r of rows) {
    dedupeMap.set(r.uid, r);
  }
  const uniqueRows = Array.from(dedupeMap.values());
  console.log(`Deduplicated to ${uniqueRows.length} unique entries`);

  const client = new Client({
    host: process.env.POKEMON_DB_HOST || 'localhost',
    port: Number(process.env.POKEMON_DB_PORT) || 5432,
    user: process.env.POKEMON_DB_USERNAME,
    password: process.env.POKEMON_DB_PASSWORD,
    database: process.env.POKEMON_DB_NAME || 'pokemon',
  });

  await client.connect();

  try {
    if (rows.length === 0) {
      console.log('No rows to insert');
      return;
    }

    // Insert in chunks to avoid very large statements and duplicate-value conflicts
    const CHUNK_SIZE = 10;
    for (let i = 0; i < uniqueRows.length; i += CHUNK_SIZE) {
      const chunk = uniqueRows.slice(i, i + CHUNK_SIZE);
      const values: any[] = [];
      const placeholders: string[] = [];
      chunk.forEach((r, j) => {
        const idx = j * 21;
        placeholders.push(
          `($${idx + 1}::uuid, $${idx + 2}, $${idx + 3}, $${idx + 4}, $${idx + 5}, $${
            idx + 6
          }, $${idx + 7}, $${idx + 8}, $${idx + 9}, $${idx + 10}, $${
            idx + 11
          }, $${idx + 12}, $${idx + 13}, $${idx + 14}, $${idx + 15}, $${
            idx + 16
          }, $${idx + 17}, $${idx + 18}, $${idx + 19}, $${idx + 20}, $${idx + 21})`
        );
        values.push(
          r.uid,
          r.name,
          r.national,
          r.gen,
          r.formid,
          r.formname,
          r.release,
          r.type1,
          r.type2,
          r.stats,
          r.species,
          r.height,
          r.weight,
          r.gender,
          r.catchRate,
          r.baseExp,
          r.eggCycles,
          r.friendship,
          r.growthRate,
          r.evYield,
          r.spriteUrl || null
        );
      });

      const sql = `INSERT INTO pokemon(uid,name,national,gen,formid,formname,release,type1,type2,stats,species,height,weight,gender,"catchRate","baseExp","eggCycles",friendship,"growthRate","evYield","spriteUrl") VALUES ${placeholders.join(
        ', '
      )} ON CONFLICT ("uid") DO UPDATE SET "name" = EXCLUDED."name"`;
      await client.query('BEGIN');
      await client.query(sql, values);
      await client.query('COMMIT');
      console.log(
        `Inserted chunk ${i / CHUNK_SIZE + 1} (${chunk.length} rows)`
      );
    }

    console.log('Seeding complete');
  } catch (err: unknown) {
    await client.query('ROLLBACK').catch((error) => error);
    console.error('Seeding error:', err);
  } finally {
    await client.end();
  }
}

/**
 * This script is responsible for seeding the Pokémon and user profile data into the PostgreSQL database.
 * It reads Pokémon data from YAML files, processes it, and inserts it into the database using raw SQL queries.
 * The script also seeds user profile data from an SQL file. It handles database connections and transactions to ensure data integrity.
 * To run this script, ensure that the database connection parameters are set in the environment variables and execute the script with Node.js.
 */
async function seed_profile_data(path: string) {
  const sql = fs.readFileSync(path, 'utf8');
  const client = new Client({
    host: process.env.POKEMON_DB_HOST || 'localhost',
    port: Number(process.env.POKEMON_DB_PORT) || 5432,
    user: process.env.POKEMON_DB_USERNAME,
    password: process.env.POKEMON_DB_PASSWORD,
    database: process.env.POKEMON_DB_NAME || 'pokemon',
  });

  await client.connect();
  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('Profile seeding complete');
  } catch (err: unknown) {
    await client.query('ROLLBACK').catch((error) => error);
    console.error('Profile seeding error:', err);
  } finally {
    await client.end();
  }
}

seed_pokemon_data().catch((e) => {
  console.error(e);
  process.exit(1);
});

seed_profile_data(SEED_PROFILES).catch((e) => {
  console.error(e);
  process.exit(1);
});
