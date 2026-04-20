import { toErrorHandler } from '../../app/helpers/to-error-handler';
import { AddButton, Card, DexNumber, PokeName, Sprite, SpriteWrapper } from './components';
import type { PokemonCardPropTypes } from "./types/pokemon-card-types";

export function PokemonCard({
  pokemon,
  profileId,
  onAdd,
  isOnTeam,
  isTeamFull,
  index = 0,
}: PokemonCardPropTypes) {
  const isDisabled = isTeamFull && !isOnTeam;
  const buttonLabel = isOnTeam ? '✓ On Team' : isDisabled ? 'Team Full' : '+ Add';
  const addPokemonToTeam = (): void | string => {
    if (isDisabled || isOnTeam) return toErrorHandler(new Error('Cannot add Pokémon to team: team is full or Pokémon is already on team.'));
    onAdd(profileId, pokemon.uid);
  };

  return (
    <Card $index={index} $isOnTeam={isOnTeam}>
      <DexNumber>#{String(pokemon.id).padStart(3, '0')}</DexNumber>
      <SpriteWrapper>
        <Sprite
          src={pokemon.spriteUrl}
          alt={pokemon.name}
          $isOnTeam={isOnTeam}
          loading="lazy"
        />
      </SpriteWrapper>
      <PokeName>{pokemon.name}</PokeName>
      <AddButton
        $isOnTeam={isOnTeam}
        $disabled={isDisabled}
        disabled={isDisabled || isOnTeam}
        onClick={addPokemonToTeam}
        aria-label={`${buttonLabel} ${pokemon.name}`}
      >
        {buttonLabel}
      </AddButton>
    </Card>
  );
}