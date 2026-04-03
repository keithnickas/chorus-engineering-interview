import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ProfilePokemonService } from '@pokemon-user-backend/services/profile-pokemon/profile-pokemon.service';
import { ProfilePokemon } from '@pokemon-user-backend/modules/database/entities/profile-pokemon.entity';
import { Profile } from '@pokemon-user-backend/modules/database/entities/profile.entity';
import { Pokemon } from '@pokemon-user-backend/modules/database/entities/pokemon.entity';

const profileUid = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' as Profile['uid'];
const pokemonUid = 'b2c3d4e5-f6a7-8901-bcde-f12345678901' as Pokemon['uid'];

const mockProfile = (): Profile => ({
  id: 1,
  uid: profileUid,
  name: 'Ash',
  description: null,
  email: 'ash@pallet.town',
  pokemons: [],
  createdAt: new Date(),
});

const mockPokemon = (): Pokemon => ({
  id: 10,
  uid: pokemonUid,
  name: 'Pikachu',
  national: 25,
  gen: 1,
  formid: null,
  formname: null,
  release: null,
  type1: 'Electric',
  type2: null,
  stats: { hp: 35, attack: 55, defense: 40, spattack: 50, spdefense: 50, speed: 90 },
  species: 'Mouse',
  height: 0.4,
  weight: 6.0,
  gender: 'M/F',
  catchRate: 190,
  baseExp: 112,
  eggCycles: 10,
  friendship: 70,
  growthRate: 'Medium Fast',
  evYield: { speed: 2 },
  spriteUrl: null,
  pokemons: [],
});

const mockProfilePokemon = (): ProfilePokemon => ({
  id: 100,
  profile: mockProfile(),
  pokemon: mockPokemon(),
  slot: 1,
  createdAt: new Date(),
});

describe('ProfilePokemonService', () => {
  let service: ProfilePokemonService;
  let profilePokemonRepo: jest.Mocked<Repository<ProfilePokemon>>;
  let profileRepo: jest.Mocked<Repository<Profile>>;
  let pokemonRepo: jest.Mocked<Repository<Pokemon>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilePokemonService,
        {
          provide: getRepositoryToken(ProfilePokemon),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            count: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Profile),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Pokemon),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProfilePokemonService>(ProfilePokemonService);
    profilePokemonRepo = module.get(getRepositoryToken(ProfilePokemon));
    profileRepo = module.get(getRepositoryToken(Profile));
    pokemonRepo = module.get(getRepositoryToken(Pokemon));
  });

  describe('getTeam', () => {
    it('returns the team for a valid profile', async () => {
      const team = [mockProfilePokemon()];
      profileRepo.findOne.mockResolvedValue(mockProfile());
      profilePokemonRepo.find.mockResolvedValue(team);

      const result = await service.getTeam(profileUid);

      expect(profileRepo.findOne).toHaveBeenCalledWith({ where: { uid: profileUid } });
      expect(profilePokemonRepo.find).toHaveBeenCalledWith({
        where: { profile: { id: 1 } },
        order: { slot: 'ASC' },
      });
      expect(result).toEqual(team);
    });

    it('throws NotFoundException when profile does not exist', async () => {
      profileRepo.findOne.mockResolvedValue(null);

      await expect(service.getTeam(profileUid)).rejects.toThrow(NotFoundException);
    });
  });

  describe('addToTeam', () => {
    it('throws NotFoundException when profile not found', async () => {
      profileRepo.findOne.mockResolvedValue(null);

      await expect(service.addToTeam(profileUid, pokemonUid)).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException when pokemon not found', async () => {
      profileRepo.findOne.mockResolvedValue(mockProfile());
      pokemonRepo.findOne.mockResolvedValue(null);

      await expect(service.addToTeam(profileUid, pokemonUid)).rejects.toThrow(NotFoundException);
    });

    it('returns existing entry if pokemon already on team', async () => {
      const existing = mockProfilePokemon();
      profileRepo.findOne.mockResolvedValue(mockProfile());
      pokemonRepo.findOne.mockResolvedValue(mockPokemon());
      profilePokemonRepo.findOne.mockResolvedValue(existing);

      const result = await service.addToTeam(profileUid, pokemonUid);

      expect(profilePokemonRepo.save).not.toHaveBeenCalled();
      expect(result).toEqual(existing);
    });

    it('throws BadRequestException when team is full', async () => {
      profileRepo.findOne.mockResolvedValue(mockProfile());
      pokemonRepo.findOne.mockResolvedValue(mockPokemon());
      profilePokemonRepo.findOne.mockResolvedValue(null);
      profilePokemonRepo.count.mockResolvedValue(6);

      await expect(service.addToTeam(profileUid, pokemonUid)).rejects.toThrow(BadRequestException);
    });

    it('adds pokemon to team in the first available slot', async () => {
      const profile = mockProfile();
      const pokemon = mockPokemon();
      const saved = mockProfilePokemon();

      profileRepo.findOne.mockResolvedValue(profile);
      pokemonRepo.findOne.mockResolvedValue(pokemon);
      profilePokemonRepo.findOne.mockResolvedValue(null);
      profilePokemonRepo.count.mockResolvedValue(0);
      profilePokemonRepo.find.mockResolvedValue([]);
      profilePokemonRepo.create.mockReturnValue(saved);
      profilePokemonRepo.save.mockResolvedValue(saved);

      const result = await service.addToTeam(profileUid, pokemonUid);

      expect(profilePokemonRepo.create).toHaveBeenCalledWith({ profile, pokemon, slot: 1 });
      expect(profilePokemonRepo.save).toHaveBeenCalledWith(saved);
      expect(result).toEqual(saved);
    });

    it('assigns the lowest available slot when some slots are taken', async () => {
      const profile = mockProfile();
      const pokemon = mockPokemon();
      const saved = { ...mockProfilePokemon(), slot: 2 };

      const existingEntry = { ...mockProfilePokemon(), slot: 1 };

      profileRepo.findOne.mockResolvedValue(profile);
      pokemonRepo.findOne.mockResolvedValue(pokemon);
      profilePokemonRepo.findOne.mockResolvedValue(null);
      profilePokemonRepo.count.mockResolvedValue(1);
      profilePokemonRepo.find.mockResolvedValue([existingEntry]);
      profilePokemonRepo.create.mockReturnValue(saved);
      profilePokemonRepo.save.mockResolvedValue(saved);

      const result = await service.addToTeam(profileUid, pokemonUid);

      expect(profilePokemonRepo.create).toHaveBeenCalledWith({ profile, pokemon, slot: 2 });
      expect(result).toEqual(saved);
    });
  });

  describe('removeFromTeam', () => {
    it('throws NotFoundException when profile not found', async () => {
      profileRepo.findOne.mockResolvedValue(null);

      await expect(service.removeFromTeam(profileUid, pokemonUid)).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException when pokemon not found', async () => {
      profileRepo.findOne.mockResolvedValue(mockProfile());
      pokemonRepo.findOne.mockResolvedValue(null);

      await expect(service.removeFromTeam(profileUid, pokemonUid)).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException when team entry not found', async () => {
      profileRepo.findOne.mockResolvedValue(mockProfile());
      pokemonRepo.findOne.mockResolvedValue(mockPokemon());
      profilePokemonRepo.findOne.mockResolvedValue(null);

      await expect(service.removeFromTeam(profileUid, pokemonUid)).rejects.toThrow(NotFoundException);
    });

    it('removes the team entry successfully', async () => {
      const entry = mockProfilePokemon();
      profileRepo.findOne.mockResolvedValue(mockProfile());
      pokemonRepo.findOne.mockResolvedValue(mockPokemon());
      profilePokemonRepo.findOne.mockResolvedValue(entry);
      profilePokemonRepo.remove.mockResolvedValue(entry);

      await service.removeFromTeam(profileUid, pokemonUid);

      expect(profilePokemonRepo.remove).toHaveBeenCalledWith(entry);
    });
  });
});
