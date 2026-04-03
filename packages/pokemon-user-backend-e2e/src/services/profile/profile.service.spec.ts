import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileService } from '@pokemon-user-backend/services/profile/profile.service';
import { Profile } from '@pokemon-user-backend/modules/database/entities/profile.entity';
import { CreateProfileDto } from '@pokemon-user-backend/controllers/profile/dto/create-profile.dto';

const mockProfile = (overrides: Partial<Profile> = {}): Profile => ({
  id: 1,
  uid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' as Profile['uid'],
  name: 'Ash Ketchum',
  description: 'Pokemon trainer',
  email: 'ash@pallet.town',
  pokemons: [],
  createdAt: new Date('2024-01-01'),
  ...overrides,
});

describe('ProfileService', () => {
  let service: ProfileService;
  let repo: jest.Mocked<Repository<Profile>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: getRepositoryToken(Profile),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    repo = module.get(getRepositoryToken(Profile));
  });

  describe('findAll', () => {
    it('returns all profiles', async () => {
      const profiles = [mockProfile()];
      repo.find.mockResolvedValue(profiles);

      const result = await service.findAll();

      expect(repo.find).toHaveBeenCalled();
      expect(result).toEqual(profiles);
    });

    it('returns empty array when no profiles exist', async () => {
      repo.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('getProfile', () => {
    it('finds by uid when uid is provided', async () => {
      const profile = mockProfile();
      repo.findOne.mockResolvedValue(profile);

      const result = await service.getProfile({ uid: profile.uid });

      expect(repo.findOne).toHaveBeenCalledWith({ where: { uid: profile.uid } });
      expect(result).toEqual(profile);
    });

    it('finds by email when email is provided', async () => {
      const profile = mockProfile();
      repo.findOne.mockResolvedValue(profile);

      const result = await service.getProfile({ email: 'ash@pallet.town' });

      expect(repo.findOne).toHaveBeenCalledWith({ where: { email: 'ash@pallet.town' } });
      expect(result).toEqual(profile);
    });

    it('returns null when neither uid nor email provided', async () => {
      const result = await service.getProfile({});

      expect(repo.findOne).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('returns null when profile not found by uid', async () => {
      repo.findOne.mockResolvedValue(null);

      const result = await service.getProfile({ uid: 'nonexistent-uid' as Profile['uid'] });

      expect(result).toBeNull();
    });
  });

  describe('resolveByIdentifier', () => {
    it('finds by numeric id when identifier is a positive number', async () => {
      const profile = mockProfile();
      repo.findOneBy.mockResolvedValue(profile);

      const result = await service.resolveByIdentifier(1);

      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(profile);
    });

    it('falls through to uid lookup when numeric id not found', async () => {
      const profile = mockProfile();
      repo.findOneBy.mockResolvedValue(null);
      repo.findOne.mockResolvedValue(profile);

      const result = await service.resolveByIdentifier(999);

      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 999 });
      expect(repo.findOne).toHaveBeenCalled();
      expect(result).toEqual(profile);
    });

    it('finds by uid when identifier is a string', async () => {
      const profile = mockProfile();
      repo.findOne.mockResolvedValue(profile);

      const result = await service.resolveByIdentifier('a1b2c3d4-e5f6-7890-abcd-ef1234567890');

      expect(repo.findOneBy).not.toHaveBeenCalled();
      expect(repo.findOne).toHaveBeenCalled();
      expect(result).toEqual(profile);
    });
  });

  describe('createProfile', () => {
    it('creates and saves a new profile', async () => {
      const dto: CreateProfileDto = {
        name: 'Ash Ketchum',
        email: 'ash@pallet.town',
        description: 'Pokemon trainer',
      };
      const created = mockProfile();
      const saved = mockProfile();

      repo.create.mockReturnValue(created);
      repo.save.mockResolvedValue(saved);

      const result = await service.createProfile(dto);

      expect(repo.create).toHaveBeenCalledWith({
        name: dto.name,
        description: dto.description,
        email: dto.email,
      });
      expect(repo.save).toHaveBeenCalledWith(created);
      expect(result).toEqual(saved);
    });
  });
});
