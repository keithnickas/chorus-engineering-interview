import { Global } from '@emotion/react';
import { AppShell, MainContent } from '@pokemon-ui/components/layouts/main-app';
import { SkipLink } from '@pokemon-ui/components/layouts/skip-link';
import {
  CenteredState,
  StateLabel,
  Spinner,
  ProfileBar,
  PokedexSection,
  PokedexPanel,
  TeamSection,
  TeamPanel,
  ErrorToast,
} from '@pokemon-ui/components';
import { useTeam } from '@pokemon-ui/hooks/use-team';
import { globalStyles } from '@pokemon-ui/css/global-styles';

export function App() {
  const {
    pokemon,
    profiles,
    activeProfile,
    loading,
    error,
    isTeamFull,
    isPokemonOnTeam,
    selectProfile,
    addProfile,
    removeProfile,
    addToTeam,
    removeFromTeam,
  } = useTeam();

  return (
    <>
      <Global styles={globalStyles} />
      <AppShell>
        <SkipLink href="#main-content">Skip to main content</SkipLink>
        <ProfileBar
          profiles={profiles}
          activeProfile={activeProfile}
          onSelect={selectProfile}
          onAdd={addProfile}
          onDelete={removeProfile}
        />

        <MainContent id="main-content">
          {loading ? (
            <CenteredState>
              <Spinner />
              <StateLabel>Initializing Pokédex...</StateLabel>
            </CenteredState>
          ) : (
            <>
              <PokedexSection aria-label="Pokédex">
                <PokedexPanel
                  pokemon={pokemon}
                  profileId={activeProfile?.uid!}
                  onAdd={addToTeam}
                  isPokemonOnTeam={isPokemonOnTeam}
                  isTeamFull={isTeamFull}
                />
              </PokedexSection>

              <TeamSection aria-label="Active Team">
                <TeamPanel profile={activeProfile} onRemove={removeFromTeam} />
              </TeamSection>
            </>
          )}
        </MainContent>

        {/* Non-blocking error toast for action failures */}
        {!loading && error && (
          <ErrorToast role="alert" aria-live="assertive">
            {error}
          </ErrorToast>
        )}
      </AppShell>
    </>
  );
}

export default App;
