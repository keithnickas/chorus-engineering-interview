import { UUID } from "node:crypto";
import { TeamSlot } from "../../../api/types/api";

export interface TeamSlotPropTypes {
  slot: number;
  data: TeamSlot | null;
  onRemove: (pokemonId: UUID) => void;
  index?: number;
}