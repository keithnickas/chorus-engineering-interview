import 'reflect-metadata';
import { ProfileModule } from '@pokemon-user-backend/modules/profile/profile.module';
import { ProfileController } from '@pokemon-user-backend/controllers/profile/profile.controller';
import { ProfileService } from '@pokemon-user-backend/services/profile/profile.service';
import { ProfilePokemonService } from '@pokemon-user-backend/services/profile-pokemon/profile-pokemon.service';

describe('ProfileModule', () => {
  it('is decorated as a NestJS module', () => {
    const metadata = Reflect.getMetadata('imports', ProfileModule);
    expect(metadata).toBeDefined();
  });

  it('declares ProfileController', () => {
    const controllers: unknown[] = Reflect.getMetadata('controllers', ProfileModule);
    expect(controllers).toContain(ProfileController);
  });

  it('provides ProfileService', () => {
    const providers: unknown[] = Reflect.getMetadata('providers', ProfileModule);
    expect(providers).toContain(ProfileService);
  });

  it('provides ProfilePokemonService', () => {
    const providers: unknown[] = Reflect.getMetadata('providers', ProfileModule);
    expect(providers).toContain(ProfilePokemonService);
  });

  it('exports ProfileService', () => {
    const exports: unknown[] = Reflect.getMetadata('exports', ProfileModule);
    expect(exports).toContain(ProfileService);
  });

  it('exports ProfilePokemonService', () => {
    const exports: unknown[] = Reflect.getMetadata('exports', ProfileModule);
    expect(exports).toContain(ProfilePokemonService);
  });
});
