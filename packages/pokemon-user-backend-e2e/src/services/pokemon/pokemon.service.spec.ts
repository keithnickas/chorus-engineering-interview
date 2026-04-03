import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

describe('PokemonService', () => {
  let service: PokemonService;
  let repo: jest.Mocked<Repository<Pokemon>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonService,
        {
          provide: getRepositoryToken(Pokemon),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PokemonService>(PokemonService);
    repo = module.get(getRepositoryToken(Pokemon));
  });

  describe('findAll', () => {
    it('returns an array of pokemon', async () => {
      const pokemon = [mockPokemon()];
      repo.find.mockResolvedValue(pokemon);

      const result = await service.findAll({ take: 10, skip: 0 });

      expect(repo.find).toHaveBeenCalledWith({ take: 10, skip: 0 });
      expect(result).toEqual(pokemon);
    });

    it('uses undefined params when called with no arguments', async () => {
      repo.find.mockResolvedValue([]);

      await service.findAll();

      expect(repo.find).toHaveBeenCalledWith({ take: undefined, skip: undefined });
    });

    it('returns empty array when no pokemon exist', async () => {
      repo.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('returns a pokemon when found', async () => {
      const pokemon = mockPokemon();
      repo.findOneBy.mockResolvedValue(pokemon);

      const result = await service.findOne(1);

      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(pokemon);
    });

    it('returns null when pokemon not found', async () => {
      repo.findOneBy.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });
});
