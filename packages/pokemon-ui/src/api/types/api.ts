import { UUID } from "node:crypto";

export interface Pokemon {
  id: number;
  uid: UUID;
  name: string;
  spriteUrl: string;
}

export interface TeamSlot {
  slot: number;
  pokemon: Pokemon;
}

export interface ProfilePokemon {
  slot: number;
  pokemon: Pokemon;
}

export interface Profile {
  id: number;
  uid: UUID;
  name: string;
  pokemons?: ProfilePokemon[];
}
