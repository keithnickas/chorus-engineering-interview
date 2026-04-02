import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { ProfilePokemon } from '../../modules/database/entities/profile-pokemon.entity';
import { Profile } from '../../modules/database/entities/profile.entity';
import { Pokemon } from '../../modules/database/entities/pokemon.entity';
import { UUID } from 'crypto';

/**
 * Service responsible for managing the association between user profiles and their Pokémon teams.
 * Provides methods to retrieve a user's team, add a Pokémon to the team, and remove a Pokémon from the team.
 * This service interacts with the database through TypeORM repositories for ProfilePokemon, Profile, and Pokemon entities.
 * It is used by controllers to handle incoming requests related to user teams and their Pokémon.
 */
@Injectable()
export class ProfilePokemonService {
  constructor(
    @InjectRepository(ProfilePokemon)
    private readonly profilePokemonRepo: Repository<ProfilePokemon>,
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
    @InjectRepository(Pokemon)
    private readonly pokemonRepo: Repository<Pokemon>,
  ) {}

  /**
   * Retrieves the Pokémon team for a given user's profile.
   * @param profileUid The UUID of the user's profile.
   * @returns An array of ProfilePokemon entries representing the user's team.
   */
  async getTeam(profileUid: UUID): Promise<ProfilePokemon[]> {
    const profile = await this.profileRepo.findOne({ where: { uid: profileUid } });

    if (!profile) throw new NotFoundException('Profile not found');

    return this.profilePokemonRepo.find({ where: { profile: { id: profile.id } }, order: { slot: 'ASC' } });
  }

  /**
   * Adds a Pokémon to a user's team, ensuring no duplicates and a maximum of 6 Pokémon per team.
   * @param profileUid The UUID of the user's profile.
   * @param pokemonUid The UUID of the Pokémon to add.
   * @returns The added or existing ProfilePokemon entry.
   */
  async addToTeam(profileUid: UUID, pokemonUid: UUID): Promise<ProfilePokemon> {
    const profile = await this.profileRepo.findOne({ where: { uid: profileUid } });
    if (!profile) throw new NotFoundException('Profile not found');

    const pokemon = await this.pokemonRepo.findOne({ where: { uid: pokemonUid } });
    if (!pokemon) throw new NotFoundException('Pokemon not found');

    const existing = await this.profilePokemonRepo.findOne({ where: { profile: { id: profile.id }, pokemon: { id: pokemon.id } } });
    if (existing) return existing;

    const count = await this.profilePokemonRepo.count({ where: { profile: { id: profile.id } } });
    if (count >= 6) throw new BadRequestException('Team is full (max 6 allowed)');

    // determine next available slot for this profile by finding existing entries and their slot numbers
    const entries = await this.profilePokemonRepo.find({ where: { profile: { id: profile.id } } });
    const usedSlots = new Set(entries.map((e) => e.slot));
    let slot = 1;
    // find the lowest available slot number from 1 to 6
    for (let s = 1; s <= 6; s++) {
      if (!usedSlots.has(s)) {
        slot = s;
        break;
      }
    }

    const record = this.profilePokemonRepo.create({ profile, pokemon, slot });
    return this.profilePokemonRepo.save(record);
  }

  /**
   * Removes a Pokémon from a user's team.
   * @param profileUid The UUID of the user's profile.
   * @param pokemonUid The UUID of the Pokémon to remove.
   */
  async removeFromTeam(profileUid: UUID, pokemonUid: UUID): Promise<void> {
    const profile = await this.profileRepo.findOne({ where: { uid: profileUid } });
    if (!profile) throw new NotFoundException('Profile not found');

    const pokemon = await this.pokemonRepo.findOne({ where: { uid: pokemonUid } });
    if (!pokemon) throw new NotFoundException('Pokemon not found');

    const existing = await this.profilePokemonRepo.findOne({ where: { profile: { id: profile.id }, pokemon: { id: pokemon.id } } });
    if (!existing) throw new NotFoundException('Team entry not found');

    await this.profilePokemonRepo.remove(existing);
  }
}
