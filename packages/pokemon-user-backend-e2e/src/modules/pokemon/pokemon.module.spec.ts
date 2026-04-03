import 'reflect-metadata';
import { PokemonModule } from '@pokemon-user-backend/modules/pokemon/pokemon.module';
import { PokemonController } from '@pokemon-user-backend/controllers/pokemon/pokemon.controller';
import { PokemonService } from '@pokemon-user-backend/services/pokemon/pokemon.service';

describe('PokemonModule', () => {
  it('is decorated as a NestJS module', () => {
    const metadata = Reflect.getMetadata('imports', PokemonModule);
    expect(metadata).toBeDefined();
  });

  it('declares PokemonController', () => {
    const controllers: unknown[] = Reflect.getMetadata('controllers', PokemonModule);
    expect(controllers).toContain(PokemonController);
  });

  it('provides PokemonService', () => {
    const providers: unknown[] = Reflect.getMetadata('providers', PokemonModule);
    expect(providers).toContain(PokemonService);
  });

  it('exports PokemonService', () => {
    const exports: unknown[] = Reflect.getMetadata('exports', PokemonModule);
    expect(exports).toContain(PokemonService);
  });
});
