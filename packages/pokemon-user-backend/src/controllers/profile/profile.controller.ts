import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { ProfileService } from '../../services/profile/profile.service';
import { ProfilePokemonService } from '../../services/profile-pokemon/profile-pokemon.service';
import { UUID } from 'node:crypto';
import { Profile } from '../../modules/database/entities/profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { AddToTeamDto } from './dto/add-to-team.dto';
import { ProfilePokemon } from '../../modules/database/entities/profile-pokemon.entity';

/**
 * The ProfileController is responsible for handling HTTP requests related to
 * user profiles and their associated Pokémon teams.
 * It defines endpoints for listing profiles, retrieving a specific profile, 
 * creating a new profile, and managing a user's Pokémon team.
 * The controller interacts with the ProfileService for profile management and
 * the ProfilePokemonService for managing the association between profiles and Pokémon.
 */
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly profilePokemonService: ProfilePokemonService
  ) {}

  /**
   * Retrieves a list of all user profiles.
   * @returns A string representation of the list of user profiles.
   */
  @Get('/')
  async listProfiles(): Promise<Profile[]> {
    return this.profileService.findAll();
  }

  /**
   * Retrieves a specific user profile by UUID.
   * @param uid The UUID of the user's profile.
   * @returns The Profile entity corresponding to the provided UUID,
   * or a NotFoundException if the profile does not exist.
   */
  @Get('/:uid')
  async getProfile(@Param('uid') uid: UUID): Promise<Profile> {
    const profile = await this.profileService.getProfile({ uid });

    if (!profile) {
      console.error('Profile not found for UID:', uid);
      throw new NotFoundException(`Profile not found: ${uid}`);
    }

    return profile;
  }

  /**
   * Creates a new user profile.
   * @param body The request body containing profile details.
   * @returns The created Profile entity.
   */
  @Post('/create')
  async createProfile(
    @Body()
    body: CreateProfileDto
  ): Promise<Profile> {
    if (!body || typeof body !== 'object') {
      throw new BadRequestException(`Invalid request body: ${body}`);
    }

    const hasExistingProfile = await this.profileService.getProfile({
      uid: body.uid,
      email: body.email,
    });

    if (hasExistingProfile) throw new ConflictException('Profile already exists');

    return this.profileService.createProfile(body);
  }

  /**
   * Retrieves the Pokémon team for a specific user profile.
   * @param uid The UUID of the user's profile.
   * @returns An array of ProfilePokemon entries representing the user's team.
   */
  @Get('/:uid/team')
  async getTeam(@Param('uid') uid: UUID): Promise<ProfilePokemon[]> {
    if (!uid) {
      throw new BadRequestException('Profile UID is required');
    }
    
    return this.profilePokemonService.getTeam(uid);
  }

  /**
   * Adds a Pokémon to a user's team.
   * @param uid The UUID of the user's profile.
   * @param body The request body containing the UUID of the Pokémon to add.
   * @returns The added or existing ProfilePokemon entry.
   */
  @Post('/:uid/team')
  async addToTeam(
    @Param('uid') uid: UUID,
    @Body() body: AddToTeamDto
  ): Promise<ProfilePokemon> {
    if (!body || !body.pokemonId) {
      throw new BadRequestException('Pokemon ID is required');
    }
    return this.profilePokemonService.addToTeam(uid, body.pokemonId);
  }

  /**
   * Removes a Pokémon from a user's team.
   * @param uid The UUID of the user's profile.
   * @param pokemonId The UUID of the Pokémon to remove.
   * @returns A message indicating the result of the removal.
   */
  @Delete('/:uid/team/:pokemonId')
  async removeFromTeam(
    @Param('uid') uid: UUID,
    @Param('pokemonId') pokemonId: UUID
  ): Promise<void> {
    if (!pokemonId) {
      throw new BadRequestException('Pokemon ID is required');
    }
    if (!uid) {
      throw new BadRequestException('Profile UID is required');
    }

    return this.profilePokemonService.removeFromTeam(uid, pokemonId);
  }
}
