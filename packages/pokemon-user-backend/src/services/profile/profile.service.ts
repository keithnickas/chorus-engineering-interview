import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../../modules/database/entities/profile.entity';
import { UUID } from 'node:crypto';
import { CreateProfileDto } from '../../controllers/profile/dto/create-profile.dto';

/**
 * Service responsible for managing user profiles, including retrieval and creation of profiles.
 * Provides methods to find profiles by various identifiers and to create new profiles.
 */
@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly repo: Repository<Profile>,
  ) {}

  findAll(): Promise<Profile[]> {
    return this.repo.find({
      relations: ['pokemons', 'pokemons.pokemon'],
      order: { createdAt: 'DESC' }
    });
  }

  /**
   * Retrieves a user profile based on provided identifiers (UUID or email).
   * @param uid Optional UUID of the profile to retrieve.
   * @param email Optional email of the profile to retrieve.
   * @returns The matching Profile entity or null if not found.
   */
  async getProfile({uid, email}: {uid?: UUID, email?: string}): Promise<Profile | null> {
    if (uid) {
      return this.repo.findOne({ 
        where: { uid },
        relations: ['pokemons', 'pokemons.pokemon']
      });
    }
    if (email) {
      return this.repo.findOne({ 
        where: { email },
        relations: ['pokemons', 'pokemons.pokemon']
      });
    }
    return null;
  }

  /**
   * Resolves a user profile based on a given identifier, which can be either a numeric ID or a UUID.
   * @param identifier The identifier to resolve the profile by.
   * @returns The matching Profile entity or null if not found.
   */
  async resolveByIdentifier(identifier: unknown): Promise<Profile | null> {
    const isNumber = Number(identifier);
    if (!Number.isNaN(isNumber) && isNumber > 0) {
      const byId = await this.repo.findOneBy({ id: isNumber });
      if (byId) return byId;
    }
    return this.repo.findOne({ where: { uid: identifier as UUID } });
  }

  /**
   * Creates a new user profile with the provided details.
   * @param body The request body containing profile details.
   * @returns The newly created Profile entity.
   */
  async createProfile(body: CreateProfileDto): Promise<Profile> {
    const newProfile = this.repo.create({ 
      name: body.name, 
      description: body.description, 
      email: body.email 
    });
    return this.repo.save(newProfile);
  }
}
