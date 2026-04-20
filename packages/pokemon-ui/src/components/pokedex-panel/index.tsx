import { useMemo, useState } from 'react';
import { PanelSection, PanelSectionHeader, PanelTitle } from '../pokemon-card/components/panel';
import {
  EmptySearch,
  EmptySearchIcon,
  EmptySearchText,
  ResultCount,
  SearchIcon,
  SearchInput,
  SearchWrapper,
} from '../pokemon-card/components/search';
import { Grid } from '../layouts/grid';
import { PokemonCard } from '../pokemon-card';
import { PokedexPanelPropTypes } from '../pokemon-card/types/pokedex-panel-types';

export function PokedexPanel({
  pokemon,
  profileId,
  onAdd,
  isPokemonOnTeam,
  isTeamFull,
}: PokedexPanelPropTypes) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const filterValue = query.trim().toLowerCase();
    if (!filterValue) return pokemon;
    return pokemon.filter(
      (pokeItem) =>
        pokeItem.name.toLowerCase().includes(filterValue) ||
        String(pokeItem.id).padStart(3, '0').includes(filterValue)
    );
  }, [pokemon, query]);

  const gridItems = filtered.map((pokemonItem, i) => (
    <PokemonCard
      key={pokemonItem.uid}
      pokemon={pokemonItem}
      profileId={profileId}
      onAdd={onAdd}
      isOnTeam={isPokemonOnTeam(pokemonItem.uid)}
      isTeamFull={isTeamFull}
      index={i}
    />
  ));
  const contentItems = filtered.length === 0 ? (
        <EmptySearch>
          <EmptySearchIcon>?</EmptySearchIcon>
          <EmptySearchText>No Pokémon found</EmptySearchText>
        </EmptySearch>
      ) : (
        <Grid>
          {gridItems}
        </Grid>
      )
  return (
    <PanelSection>
      <PanelSectionHeader>
        <SearchWrapper>
          <SearchIcon role="img" aria-label="Search">🔍</SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search by name or #..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            spellCheck={false}
            aria-label="Search Pokémon"
          />
        </SearchWrapper>
        <ResultCount aria-live="polite" aria-atomic="true">
          {filtered.length} / {pokemon.length}
        </ResultCount>
      </PanelSectionHeader>
      {contentItems}
    </PanelSection>
  );
}
