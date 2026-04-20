import { type Profile, ProfilePokemon } from "../types/api";
import { request } from "../handle-response";
import { UUID } from "node:crypto";

/**
 * POST `/api/profile/:uid/team`
 * Adds a Pokémon to the team at the next available slot (1-6).
 */
export async function addPokemonToTeam(
  profileId: UUID,
  pokemonId: UUID
): Promise<ProfilePokemon> {
  return request<ProfilePokemon>(`/profile/${profileId}/team`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pokemonId }),
  });
}

/**
 * DELETE `/api/profile/:uid/team/:pokemonId`
 * Removes a Pokémon from the team by pokemonId.
 */
export async function removePokemonFromTeam(
  profileId: UUID,
  pokemonId: UUID
): Promise<void> {
  return request<void>(`/profile/${profileId}/team/${pokemonId}`, {
    method: 'DELETE',
  });
}