import { Test, TestingModule } from '@nestjs/testing';
import { PokemonController } from '@pokemon-user-backend/controllers/pokemon/pokemon.controller';
import { PokemonService } from '@pokemon-user-backend/services/pokemon/pokemon.service';
import { Pokemon } from '@pokemon-user-backend/modules/database/entities/pokemon.entity';

const mockPokemon = (overrides: Partial<Pokemon> = {}): Pokemon => ({
  id: 1,
  uid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' as Pokemon['uid'],
  name: 'Bulbasaur',
  national: 1,
  gen: 1,
  formid: null,
  formname: null,
  release: null,
  type1: 'Grass',
  type2: 'Poison',
  stats: { hp: 45, attack: 49, defense: 49, spattack: 65, spdefense: 65, speed: 45 },
  species: 'Seed',
  height: 0.7,
  weight: 6.9,
  gender: 'M/F',
  catchRate: 45,
  baseExp: 64,
  eggCycles: 20,
  friendship: 70,
  growthRate: 'Medium Slow',
  evYield: { spattack: 1 },
  spriteUrl: null,
  pokemons: [],
  ...overrides,
});

describe('PokemonController', () => {
  let controller: PokemonController;
  let service: jest.Mocked<PokemonService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PokemonController],
      providers: [
        {
          provide: PokemonService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PokemonController>(PokemonController);
    service = module.get(PokemonService);
  });

  describe('findAll', () => {
    it('returns list of pokemon with default limit 150 and skip 0', async () => {
      const pokemon = [mockPokemon()];
      service.findAll.mockResolvedValue(pokemon);

      const result = await controller.findAll({});

      expect(service.findAll).toHaveBeenCalledWith({ take: 150, skip: 0 });
      expect(result).toEqual(pokemon);
    });

    it('uses provided limit and skip query params', async () => {
      const pokemon = [mockPokemon()];
      service.findAll.mockResolvedValue(pokemon);

      const result = await controller.findAll({ limit: '10', skip: '5' });

      expect(service.findAll).toHaveBeenCalledWith({ take: 10, skip: 5 });
      expect(result).toEqual(pokemon);
    });

    it('handles array query params by using the first value', async () => {
      service.findAll.mockResolvedValue([]);

      await controller.findAll({ limit: ['20', '30'], skip: ['0'] });

      expect(service.findAll).toHaveBeenCalledWith({ take: 20, skip: 0 });
    });

    it('falls back to 150 when limit is not a valid number', async () => {
      service.findAll.mockResolvedValue([]);

      await controller.findAll({ limit: 'invalid' });

      expect(service.findAll).toHaveBeenCalledWith({ take: 150, skip: 0 });
    });
  });

  describe('findOne', () => {
    it('returns a pokemon when found', async () => {
      const pokemon = mockPokemon();
      service.findOne.mockResolvedValue(pokemon);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(pokemon);
    });

    it('returns null when pokemon not found', async () => {
      service.findOne.mockResolvedValue(null);

      const result = await controller.findOne('999');

      expect(result).toBeNull();
    });

    it('passes NaN to service when id is not numeric', async () => {
      service.findOne.mockResolvedValue(null);

      await controller.findOne('notanumber');

      expect(service.findOne).toHaveBeenCalledWith(NaN);
    });
  });
});
