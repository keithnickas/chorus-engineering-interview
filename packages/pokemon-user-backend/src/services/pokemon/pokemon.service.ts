import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pokemon } from '../../modules/database/entities/pokemon.entity';

/**
 * Service responsible for managing Pokémon data, including retrieval of Pokémon lists and individual Pokémon details.
 * Provides methods to find all Pokémon with optional pagination and to find a specific Pokémon by its ID.
 * This service interacts with the database through the TypeORM repository for the Pokemon entity.
 * It is used by controllers to handle incoming requests related to Pokémon data.
 */
@Injectable()
export class PokemonService {
  constructor(
    @InjectRepository(Pokemon)
    private readonly repo: Repository<Pokemon>,
  ) {}

  /**
   * Retrieves a list of Pokémon with optional pagination parameters.
   * @param params Optional parameters for pagination, including 'take' for the number of records to retrieve and 'skip' for the number of records to skip.
   * @returns A promise that resolves to an array of Pokémon entities.
   */
  findAll(params?: { take?: number, skip?: number }): Promise<Pokemon[]> {
    return this.repo.find({ take: params?.take, skip: params?.skip });
  }

  /**
   * Retrieves a specific Pokémon by its ID.
   * @param id The ID of the Pokémon to retrieve.
   * @returns A promise that resolves to the Pokémon entity or null if not found.
   */
  findOne(id: number): Promise<Pokemon | null> {
    return this.repo.findOneBy({ id });
  }
}
