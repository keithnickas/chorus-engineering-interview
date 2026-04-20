import { IsUUID } from "class-validator";
import { UUID } from "node:crypto";

export class AddToTeamDto {
  @IsUUID()
  pokemonId!: UUID;
}
