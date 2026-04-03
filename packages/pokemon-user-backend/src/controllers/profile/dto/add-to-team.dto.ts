import { IsUUID } from "class-validator";
import { UUID } from "crypto";

export class AddToTeamDto {
  @IsUUID()
  pokemonUid: UUID;
}
