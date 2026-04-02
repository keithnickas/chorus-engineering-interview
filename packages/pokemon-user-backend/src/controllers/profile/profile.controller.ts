import { Body, Controller, Get, Param, Post, Delete } from '@nestjs/common';
import { ProfileService } from '../../services/profile/profile.service';
import { ProfilePokemonService } from '../../services/profile-pokemon/profile-pokemon.service';
import { UUID } from 'crypto';

/**
 * The ProfileController is responsible for handling HTTP requests related to user profiles and their associated Pokémon teams.
 * It defines endpoints for listing profiles, retrieving a specific profile, creating a new profile, and managing a user's Pokémon team.
 * The controller interacts with the ProfileService for profile management and the ProfilePokemonService for managing the association between profiles and Pokémon.
 */
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly profilePokemonService: ProfilePokemonService,
  ) {}

  /**
   * Retrieves a list of all user profiles.
   * @returns A JSON string representing an array of user profiles.
   */
  @Get('/')
  async listProfiles(): Promise<string> {
    const profiles = await this.profileService.findAll();
    return JSON.stringify(profiles);
  }

  /**
   * Retrieves a specific user profile by UUID.
   * @param uid The UUID of the user's profile.
   * @returns A JSON string representing the user profile.
   */
  @Get('/:uid')
  async getProfile(@Param('uid') uid: UUID): Promise<string> {
    try {
      const profile = await this.profileService.getProfile({ uid });
      return JSON.stringify(profile);
    } catch (error) {
      console.error('Error fetching profile:', error.stack || error);
      throw error.stack;
    }
  }

  /**
   * Creates a new user profile.
   * @param body The request body containing profile details.
   * @returns A message indicating the result of the profile creation.
   */
  @Post('/create')
  async createProfile(@Body() body: { uid?: UUID; name: string; description: string; email: string }): Promise<string> {
    if (!body || typeof body !== 'object') {
      console.error('Invalid request body for createProfile:', body);
      throw new Error('Invalid request body');
    }

    try {
      const hasProfile = await this.profileService.getProfile({ uid: body.uid, email: body.email });
      if (hasProfile) {
        console.error('Profile already exists:', hasProfile);
        throw new Error('Profile already exists');
      }

      const createProfileResult = await this.profileService.createProfile(body);
      console.log('Profile created successfully:', createProfileResult);
      return 'Profile created successfully.';
    } catch (error) {
      console.error('Error creating profile:', error.stack || error);
      throw error.stack;
    }
  }

  /**
   * Retrieves the Pokémon team for a specific user profile.
   * @param uid The UUID of the user's profile.
   * @returns An array of ProfilePokemon entries representing the user's team.
   */
  @Get('/:uid/team')
  async getTeam(@Param('uid') uid: UUID) {
    return this.profilePokemonService.getTeam(uid);
  }

  /**
   * Adds a Pokémon to a user's team.
   * @param uid The UUID of the user's profile.
   * @param body The request body containing the UUID of the Pokémon to add.
   * @returns The added or existing ProfilePokemon entry.
   */
  @Post('/:uid/team')
  async addToTeam(@Param('uid') uid: UUID, @Body() body: { pokemonUid: UUID }) {
    return this.profilePokemonService.addToTeam(uid, body.pokemonUid);
  }

  /**
   * Removes a Pokémon from a user's team.
   * @param uid The UUID of the user's profile.
   * @param pokemonUid The UUID of the Pokémon to remove.
   * @returns A message indicating the result of the removal.
   */
  @Delete('/:uid/team/:pokemonUid')
  async removeFromTeam(@Param('uid') uid: UUID, @Param('pokemonUid') pokemonUid: UUID) {
    return this.profilePokemonService.removeFromTeam(uid, pokemonUid);
  }
}