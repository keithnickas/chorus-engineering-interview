import { request } from "../handle-response";
import { type Pokemon } from "../types/api";

/**
 * GET `/api/pokemon`
 * Returns the full list of available Pokémon.
 */
export async function fetchAllPokemon(): Promise<Pokemon[]> {
  return request<Pokemon[]>('/pokemon');
}
