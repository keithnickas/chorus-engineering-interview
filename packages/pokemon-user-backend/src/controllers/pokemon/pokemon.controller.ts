import { Controller, Get, Param, Query } from '@nestjs/common';
import { PokemonService } from '../../services/pokemon/pokemon.service';
import { Pokemon } from '../../modules/database/entities/pokemon.entity';

/**
 * The PokemonController is responsible for handling HTTP requests related to Pokémon data.
 * It defines endpoints for retrieving a list of Pokémon and fetching details of a specific Pokémon by ID.
 * The controller interacts with the PokemonService to perform the necessary operations and return the appropriate responses.
 */
@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  /**
   * Retrieves a list of Pokémon, with optional pagination parameters (limit and skip).
   * The limit parameter specifies the maximum number of Pokémon to return, while the skip parameter specifies the number of Pokémon to skip before starting to collect the result set.
   * If no parameters are provided, it defaults to returning the first 150 Pokémon.
   * @param query An optional query object containing pagination parameters (limit and skip).
   * @returns A promise that resolves to an array of Pokémon entities.
   */
  @Get()
  async findAll(@Query() query?: Record<string, unknown>): Promise<Pokemon[]> {
      const limitRaw = query?.limit;
      const skipRaw = query?.skip;
      const limitValue = Array.isArray(limitRaw) ? limitRaw[0] : limitRaw;
      const skipValue = Array.isArray(skipRaw) ? skipRaw[0] : skipRaw;
      const numericLimit = Number(limitValue) || 150;
      const numericSkip = Number(skipValue) || 0;
      return this.pokemonService.findAll({ take: numericLimit, skip: numericSkip });
  }

  /**
   * Retrieves details of a specific Pokémon by its ID.
   * The ID is expected to be a numeric value, and the method will attempt to convert the provided ID parameter to a number before querying the service.
   * If the conversion fails or if the Pokémon with the specified ID does not exist, it will return null.
   * @param id The ID of the Pokémon to retrieve, provided as a string in the URL parameter.
   * @returns A promise that resolves to the Pokémon entity if found, or null if not found.
   */
  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<Pokemon | null> {
    const numericId = Number(id);
    return this.pokemonService.findOne(numericId);
  }
}