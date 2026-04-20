import { UUID } from "node:crypto";
import type { Pokemon } from "../../../api/types/api";

export interface PokemonCardPropTypes {
  pokemon: Pokemon;
  profileId: UUID;
  onAdd: (profileId: UUID, pokemonId: UUID) => void;
  isOnTeam: boolean;
  isTeamFull: boolean;
  /** Stagger index for entrance animation */
  index?: number;
}