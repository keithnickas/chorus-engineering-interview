import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbConfigService } from './db-config.service';
import { Pokemon } from './entities/pokemon.entity';
import { Profile } from './entities/profile.entity';
import { ProfilePokemon } from './entities/profile-pokemon.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DbConfigService,
    }),
    TypeOrmModule.forFeature([Pokemon, Profile, ProfilePokemon]),
  ],
  providers: [DbConfigService],
  exports: [TypeOrmModule],
})
export class DbModule {}
