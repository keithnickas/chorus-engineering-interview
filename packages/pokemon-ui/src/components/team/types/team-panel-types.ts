import { Profile } from "../../../api";
import { UUID } from "node:crypto";

export interface TeamPanelPropTypes {
  profile: Profile | null;
  onRemove: (pokemonId: UUID) => void;
}
