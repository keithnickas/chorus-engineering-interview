import {
  addPokemonToTeam,
  createProfile,
  deleteProfile,
  fetchAllPokemon,
  fetchAllProfiles,
  removePokemonFromTeam,
} from '../api';
import { useCallback, useEffect, useState } from 'react';
import { toErrorHandler } from '../app/helpers/to-error-handler';
import type { Pokemon, Profile } from '../api/types/api';
import { UUID } from 'node:crypto';
import { MAX_TEAM_SLOT_SIZE } from '../app/constants';

export function useTeam() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      setLoading(true);
      setError(null);
      try {
        const [pokemonList, profileList] = await Promise.all([
          fetchAllPokemon(),
          fetchAllProfiles(),
        ]);
        if (cancelled) return;
        setPokemon(pokemonList);
        setProfiles(profileList);
        if (profileList.length > 0) {
          setActiveProfile(profileList[0]);
        }
        setLoading(false);
      } catch (err) {
        if (!cancelled) setError(toErrorHandler(err));
        setError(
          toErrorHandler(err) || 'An error occurred while loading data.'
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  const activeProfiles: Profile | null =
    profiles.find((profile) => profile.uid === activeProfile?.uid) || null;
  const teamSize = activeProfiles?.pokemons?.length ?? 0;
  const isTeamFull = teamSize >= MAX_TEAM_SLOT_SIZE;

  const isPokemonOnTeam = useCallback(
    (pokemonId: UUID) =>
      activeProfiles?.pokemons?.some((slot) => slot.pokemon.uid === pokemonId) ??
      false,
    [activeProfiles]
  );

  const selectProfile = useCallback((profileId: UUID) => {
    const profile = profiles.find((profile) => profile.uid === profileId);
    if (!profile) {
      setError(toErrorHandler({ status: 404, message: 'Profile not found.' }));
      return;
    }
    setError(null);
    setActiveProfile(profile);
  }, [profiles]);

  const addProfile = useCallback(async (name: string) => {
    setError(null);
    try {
      const newProfile = await createProfile(name);
      setProfiles((prev) => [...prev, newProfile]);
      setActiveProfile(newProfile);
    } catch (err) {
      setError(toErrorHandler(err));
    }
  }, []);

  const removeProfile = useCallback(
    async (profileId: UUID) => {
      setError(null);
      try {
        await deleteProfile(profileId);
        setProfiles((prev) => {
          const updatedProfiles = prev.filter(
            (profile) => profile.uid !== profileId
          );
          if (profileId === activeProfile?.uid) {
            setActiveProfile(
              updatedProfiles.length > 0 ? updatedProfiles[0] : null
            );
          }
          return updatedProfiles;
        });
      } catch (err) {
        setError(toErrorHandler(err));
      }
    },
    [activeProfile]
  );

  const addToTeam = useCallback(
    async (profileId: UUID, pokemonId: UUID) => {
      if (!activeProfile || isTeamFull) {
        setError(
          toErrorHandler({
            status: 400,
            message: 'No active profile selected, or team is full.',
          })
        );
        return;
      }
      setError(null);

      try {
        await addPokemonToTeam(profileId, pokemonId);
        
        // Refetch the profile to get the updated team
        const updatedProfile = await fetchAllProfiles();
        const refreshedProfile = updatedProfile.find(p => p.uid === profileId);
        if (refreshedProfile) {
          setProfiles(updatedProfile);
          setActiveProfile(refreshedProfile);
        }
      } catch (err) {
        setError(toErrorHandler(err));
      }
    },
    [activeProfile, isTeamFull]
  );

  const removeFromTeam = useCallback(
    async (pokemonId: UUID) => {
      if (!activeProfile) {
        setError(
          toErrorHandler({
            status: 400,
            message: 'No active pokemon found on team.',
          })
        );
        return;
      }
      setError(null);

      try {
        await removePokemonFromTeam(activeProfile.uid, pokemonId);
        
        // Refetch the profile to get the updated team
        const updatedProfile = await fetchAllProfiles();
        const refreshedProfile = updatedProfile.find(p => p.uid === activeProfile.uid);
        if (refreshedProfile) {
          setProfiles(updatedProfile);
          setActiveProfile(refreshedProfile);
        }
      } catch (err) {
        setError(toErrorHandler(err));
      }
    },
    [activeProfile]
  );

  return {
    pokemon,
    profiles,
    activeProfile,
    loading,
    error,
    teamSize,
    selectProfile,
    addProfile,
    removeProfile,
    addToTeam,
    removeFromTeam,
    isPokemonOnTeam,
    isTeamFull,
  };
}
