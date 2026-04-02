import { ProfileController } from '../../controllers/profile/profile.controller';
import { Module } from '@nestjs/common';
import { Profile } from '../database/entities/profile.entity';
import { DbModule } from '../database/db.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileService } from '../../services/profile/profile.service';
import { ProfilePokemon } from '../database/entities/profile-pokemon.entity';
import { Pokemon } from '../database/entities/pokemon.entity';
import { ProfilePokemonService } from '../../services/profile-pokemon/profile-pokemon.service';

/**
 * The ProfileModule is responsible for managing user profiles and their associated Pokémon teams.
 * It imports necessary modules, defines controllers for handling profile-related requests,
 * and provides services for profile management and the association between profiles and Pokémon.
 */
@Module({
  imports: [DbModule, TypeOrmModule.forFeature([Profile, ProfilePokemon, Pokemon])],
  controllers: [ProfileController],
  providers: [ProfileService, ProfilePokemonService],
  exports: [ProfileService, ProfilePokemonService],
})
export class ProfileModule {}
