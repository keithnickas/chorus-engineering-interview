import { PokemonController } from '../../controllers/pokemon/pokemon.controller';
import { Module } from '@nestjs/common';
import { DbModule } from '../database/db.module';
import { Pokemon } from '../database/entities/pokemon.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PokemonService } from '../../services/pokemon/pokemon.service';

/**
 * The PokemonModule is responsible for managing Pokémon data and related operations.
 * It imports necessary modules, defines controllers for handling Pokémon-related requests,
 * and provides services for Pokémon management.
 */
@Module({
  imports: [DbModule, TypeOrmModule.forFeature([Pokemon])],
  controllers: [PokemonController],
  providers: [PokemonService],
  exports: [PokemonService],
})
export class PokemonModule {}
