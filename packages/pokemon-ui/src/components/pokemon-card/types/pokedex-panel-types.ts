import { Pokemon } from "../../../api";
import { UUID } from "node:crypto";

export interface PokedexPanelPropTypes {
  pokemon: Pokemon[];
  profileId: UUID;
  onAdd: (profileId: UUID, pokemonId: UUID) => void;
  isPokemonOnTeam: (pokemonId: UUID) => boolean;
  isTeamFull: boolean;
}
