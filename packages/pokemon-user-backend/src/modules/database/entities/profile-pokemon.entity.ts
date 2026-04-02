import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Pokemon } from './pokemon.entity';

/**
 * Represents the association between a user's profile and their Pokémon team.
 * Each entry corresponds to a specific Pokémon in a user's team, with a defined slot order.
 */
@Entity()
@Index(['profile','pokemon'], { unique: true })
export class ProfilePokemon {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Profile, (profile) => profile.pokemons)
  profile: Profile;

  @ManyToOne(() => Pokemon, (pokemon) => pokemon.pokemons, {
    eager: true,
  })
  pokemon: Pokemon;

  @Column()
  slot: number;

  @CreateDateColumn()
  createdAt: Date;
}
