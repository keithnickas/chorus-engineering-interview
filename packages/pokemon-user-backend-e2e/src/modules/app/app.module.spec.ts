import 'reflect-metadata';
import { AppModule } from '@pokemon-user-backend/modules/app/app.module';
import { PokemonModule } from '@pokemon-user-backend/modules/pokemon/pokemon.module';
import { ProfileModule } from '@pokemon-user-backend/modules/profile/profile.module';

describe('AppModule', () => {
  it('is decorated as a NestJS module', () => {
    const metadata = Reflect.getMetadata('imports', AppModule);
    expect(metadata).toBeDefined();
  });

  it('imports PokemonModule', () => {
    const imports: unknown[] = Reflect.getMetadata('imports', AppModule);
    expect(imports).toContain(PokemonModule);
  });

  it('imports ProfileModule', () => {
    const imports: unknown[] = Reflect.getMetadata('imports', AppModule);
    expect(imports).toContain(ProfileModule);
  });

  it('does not declare any controllers directly', () => {
    const controllers: unknown[] = Reflect.getMetadata('controllers', AppModule);
    expect(controllers ?? []).toHaveLength(0);
  });

  it('does not declare any providers directly', () => {
    const providers: unknown[] = Reflect.getMetadata('providers', AppModule);
    expect(providers ?? []).toHaveLength(0);
  });
});
