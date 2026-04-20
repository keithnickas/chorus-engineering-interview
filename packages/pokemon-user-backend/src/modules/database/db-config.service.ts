import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Pokemon } from './entities/pokemon.entity';
import { Profile } from './entities/profile.entity';
import { ProfilePokemon } from './entities/profile-pokemon.entity';

type DbOptions = TypeOrmModuleOptions & {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
};

@Injectable()
export class DbConfigService implements TypeOrmOptionsFactory {
  private dbOptions: DbOptions;

  constructor() {
    this.dbOptions = {
      host: process.env.POKEMON_DB_HOST || 'localhost',
      port: parseInt(process.env.POKEMON_DB_PORT || '5432', 10),
      username: process.env.POKEMON_DB_USERNAME || 'admin',
      password: process.env.POKEMON_DB_PASSWORD || 'admin',
      database: process.env.POKEMON_DB_NAME || 'pokemon',
      // Note: Set to true in development when working with entities, but false in production to avoid data loss
      synchronize: Boolean(process.env.POKEMON_DB_ENABLE_SYNCHRONIZE) || false,
      // Enable verbose retry logging for better visibility into connection issues, especially during development
      verboseRetryLog: Boolean(process.env.POKEMON_DB_VERBOSE_RETRY_LOG) || false,
    };

  }
  async createTypeOrmOptions(connectionName?: string): Promise<TypeOrmModuleOptions> {
    const { host, port, username, password, database, synchronize, verboseRetryLog } = this.dbOptions;
    return {
      type: 'postgres',
      host,
      port,
      username,
      password,
      database,
      entities: [Pokemon, Profile, ProfilePokemon],
      synchronize,
      verboseRetryLog
    };
  }
}
