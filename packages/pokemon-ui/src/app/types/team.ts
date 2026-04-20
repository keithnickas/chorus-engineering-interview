import { UUID } from "node:crypto";
import { type Pokemon, type Profile } from "../../api/types/api"

export type Team = {
  pokemon: Pokemon[];
  profiles: Profile[];
}

export interface TeamState extends Team{
  activeProfile: Profile | null;
  loading: boolean;
  error: string | null;
  teamSize: number;
  isTeamFull: boolean;
  isPokemonOnTeam: (pokemonId: UUID) => boolean;
  selectProfile: (profile: Profile) => void;
  removeProfile: (profileUid: UUID) => void;
  addPokemonToTeam: (profileId: UUID, pokemonId: UUID) => Promise<void>;
  removePokemonFromTeam: (profileId: UUID, pokemonId: UUID) => Promise<void>;
}