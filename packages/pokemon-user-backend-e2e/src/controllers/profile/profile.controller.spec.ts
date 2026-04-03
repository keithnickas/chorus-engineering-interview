import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { ProfileController } from '@pokemon-user-backend/controllers/profile/profile.controller';
import { ProfileService } from '@pokemon-user-backend/services/profile/profile.service';
import { ProfilePokemonService } from '@pokemon-user-backend/services/profile-pokemon/profile-pokemon.service';
import { Profile } from '@pokemon-user-backend/modules/database/entities/profile.entity';
import { ProfilePokemon } from '@pokemon-user-backend/modules/database/entities/profile-pokemon.entity';
import { Pokemon } from '@pokemon-user-backend/modules/database/entities/pokemon.entity';
import { CreateProfileDto } from '@pokemon-user-backend/controllers/profile/dto/create-profile.dto';
import { AddToTeamDto } from '@pokemon-user-backend/controllers/profile/dto/add-to-team.dto';

const profileUid = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' as Profile['uid'];
const pokemonUid = 'b2c3d4e5-f6a7-8901-bcde-f12345678901' as Pokemon['uid'];

const mockProfile = (overrides: Partial<Profile> = {}): Profile => ({
  id: 1,
  uid: profileUid,
  name: 'Ash Ketchum',
  description: 'Pokemon trainer',
  email: 'ash@pallet.town',
  pokemons: [],
  createdAt: new Date('2024-01-01'),
  ...overrides,
});

const mockProfilePokemon = (): ProfilePokemon => ({
  id: 100,
  profile: mockProfile(),
  pokemon: {} as Pokemon,
  slot: 1,
  createdAt: new Date(),
});

describe('ProfileController', () => {
  let controller: ProfileController;
  let profileService: jest.Mocked<ProfileService>;
  let profilePokemonService: jest.Mocked<ProfilePokemonService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: {
            findAll: jest.fn(),
            getProfile: jest.fn(),
            createProfile: jest.fn(),
          },
        },
        {
          provide: ProfilePokemonService,
          useValue: {
            getTeam: jest.fn(),
            addToTeam: jest.fn(),
            removeFromTeam: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    profileService = module.get(ProfileService);
    profilePokemonService = module.get(ProfilePokemonService);
  });

  describe('listProfiles', () => {
    it('returns all profiles', async () => {
      const profiles = [mockProfile()];
      profileService.findAll.mockResolvedValue(profiles);

      const result = await controller.listProfiles();

      expect(profileService.findAll).toHaveBeenCalled();
      expect(result).toEqual(profiles);
    });
  });

  describe('getProfile', () => {
    it('returns profile when found', async () => {
      const profile = mockProfile();
      profileService.getProfile.mockResolvedValue(profile);

      const result = await controller.getProfile(profileUid);

      expect(profileService.getProfile).toHaveBeenCalledWith({ uid: profileUid });
      expect(result).toEqual(profile);
    });

    it('throws NotFoundException when profile not found', async () => {
      profileService.getProfile.mockResolvedValue(null);

      await expect(controller.getProfile(profileUid)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createProfile', () => {
    it('creates and returns a new profile', async () => {
      const dto: CreateProfileDto = {
        name: 'Ash Ketchum',
        email: 'ash@pallet.town',
      };
      const profile = mockProfile();
      profileService.getProfile.mockResolvedValue(null);
      profileService.createProfile.mockResolvedValue(profile);

      const result = await controller.createProfile(dto);

      expect(profileService.createProfile).toHaveBeenCalledWith(dto);
      expect(result).toEqual(profile);
    });

    it('throws ConflictException when profile already exists', async () => {
      const dto: CreateProfileDto = { name: 'Ash', email: 'ash@pallet.town' };
      profileService.getProfile.mockResolvedValue(mockProfile());

      await expect(controller.createProfile(dto)).rejects.toThrow(ConflictException);
    });

    it('throws BadRequestException when body is invalid', async () => {
      await expect(controller.createProfile(null)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getTeam', () => {
    it('returns team for a given profile uid', async () => {
      const team = [mockProfilePokemon()];
      profilePokemonService.getTeam.mockResolvedValue(team);

      const result = await controller.getTeam(profileUid);

      expect(profilePokemonService.getTeam).toHaveBeenCalledWith(profileUid);
      expect(result).toEqual(team);
    });
  });

  describe('addToTeam', () => {
    it('adds pokemon to team', async () => {
      const dto: AddToTeamDto = { pokemonUid };
      const entry = mockProfilePokemon();
      profilePokemonService.addToTeam.mockResolvedValue(entry);

      const result = await controller.addToTeam(profileUid, dto);

      expect(profilePokemonService.addToTeam).toHaveBeenCalledWith(profileUid, pokemonUid);
      expect(result).toEqual(entry);
    });

    it('throws BadRequestException when pokemonUid is missing', async () => {
      await expect(controller.addToTeam(profileUid, {} as AddToTeamDto)).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when body is null', async () => {
      await expect(controller.addToTeam(profileUid, null)).rejects.toThrow(BadRequestException);
    });
  });

  describe('removeFromTeam', () => {
    it('removes pokemon from team', async () => {
      profilePokemonService.removeFromTeam.mockResolvedValue(undefined);

      await controller.removeFromTeam(profileUid, pokemonUid);

      expect(profilePokemonService.removeFromTeam).toHaveBeenCalledWith(profileUid, pokemonUid);
    });
  });
});
