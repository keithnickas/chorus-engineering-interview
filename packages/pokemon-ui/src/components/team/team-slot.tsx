import { TeamSlotPropTypes } from "./types/team-slot-types";
import { EmptyIcon, RemoveButton, SlotName, SlotNumber, SlotSprite, SlotWrapper } from "../pokemon-card/components/slots";

export function TeamSlot({ slot, data, onRemove, index = 0 }: TeamSlotPropTypes) {
  if (data) {
    return (
      <SlotWrapper $filled={true} $index={index}>
        <SlotNumber>{slot}</SlotNumber>
        <SlotSprite
          src={data.pokemon.spriteUrl}
          alt={data.pokemon.name}
          loading="lazy"
        />
        <SlotName>{data.pokemon.name}</SlotName>
        <RemoveButton
          onClick={() => onRemove(data.pokemon.uid)}
          aria-label={`Remove ${data.pokemon.name} from team`}
          title="Remove">
          ✕
        </RemoveButton>
      </SlotWrapper>
    );
  }

  return (
    <SlotWrapper $filled={false} $index={index}>
      <SlotNumber>{slot}</SlotNumber>
      <EmptyIcon aria-hidden="true">◌</EmptyIcon>
    </SlotWrapper>
  );
}