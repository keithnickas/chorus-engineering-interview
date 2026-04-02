import { Module } from '@nestjs/common';
import { PokemonModule } from '../pokemon/pokemon.module';
import { ProfileModule } from '../profile/profile.module';

/**
 * The AppModule serves as the root module of the application, orchestrating the integration of various feature modules.
 * It imports the PokemonModule and ProfileModule, which handle Pokémon data management and user profile management, respectively.
 * This module does not define any controllers or providers itself but serves as the central point for module composition.
 */
@Module({
  imports: [PokemonModule, ProfileModule],
})
export class AppModule {}
