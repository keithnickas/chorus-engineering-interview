import { MAX_TEAM_SLOT_SIZE } from "../../app/constants";
import { TeamPanelPropTypes } from "./types/team-panel-types";
import { CountLabel, CountPokemonInSlots } from "../pokemon-card/components/count";
import { Divider } from "../pokemon-card/components/divider";
import { EmptyState, EmptyStateIcon, EmptyStateText } from "../pokemon-card/components/empty-state";
import { PanelAside, PanelHeader, PanelTitle, ProfileName } from "../pokemon-card/components/panel";
import { SlotsGrid } from "../pokemon-card/components/slots";
import { TeamCount } from "./team-count";
import { TeamSlot } from "./team-slot";
import { PokemonInProfile } from "../pokemon-card/components/pokemon-in-profile";

export function TeamPanel({ profile, onRemove }: TeamPanelPropTypes) {
  if (!profile) {
    return (
      <PanelAside>
        <PanelHeader>
          <PanelTitle>Active Team</PanelTitle>
        </PanelHeader>
        <EmptyState>
          <EmptyStateIcon aria-hidden="true">◌</EmptyStateIcon>
          <EmptyStateText>No profile selected</EmptyStateText>
        </EmptyState>
      </PanelAside>
    );
  }

  // Build a fixed 6-slot array — filled slots come from the profile team,
  // empty slots are null
  const slots = Array.from({ length: MAX_TEAM_SLOT_SIZE }, (_, i) => {
    const slotNumber = i + 1;
    return profile?.pokemons?.find((s) => s.slot === slotNumber) ?? null;
  });

  const teamSlots = slots.map((slotData, i) => (
          <TeamSlot
            key={slotData ? slotData.pokemon.uid : `empty-${i}`}
            slot={slotData?.slot ?? i + 1}
            data={slotData}
            onRemove={onRemove}
            index={i}
          />
        ))

  const teamSize = profile?.pokemons?.length ?? 0;
  const isFull = teamSize === MAX_TEAM_SLOT_SIZE;
  const slotCount = Array.from({ length: teamSize }, (_, i) => (
    <PokemonInProfile key={i} $filled={i < teamSize} />
  ));

  return (
    <PanelAside>
      <PanelHeader>
        <PanelTitle>Active Team</PanelTitle>
        <ProfileName>{profile.name}</ProfileName>
        <TeamCount>
          <CountLabel>{teamSize}/{MAX_TEAM_SLOT_SIZE}</CountLabel>
          <CountPokemonInSlots>
            {slotCount}
          </CountPokemonInSlots>
          {isFull && (
            <CountLabel style={{ color: 'var(--accent)', marginLeft: 2 }}>
              Full
            </CountLabel>
          )}
        </TeamCount>
      </PanelHeader>

      <Divider />

      <SlotsGrid>
        {teamSlots}
      </SlotsGrid>
    </PanelAside>
  );
}