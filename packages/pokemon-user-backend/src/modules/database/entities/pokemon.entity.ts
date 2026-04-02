import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { ProfilePokemon } from './profile-pokemon.entity';
import { UUID } from 'crypto';

@Entity()
export class Pokemon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true })
  uid: UUID;

  @Column()
  name: string;

  @Column({ nullable: true })
  national: number;

  @Column({ nullable: true })
  gen: number;

  @Column({ nullable: true })
  formid: string;

  @Column({ nullable: true })
  formname: string;

  @Column({ nullable: true })
  release: string;

  @Column({ nullable: true })
  type1: string;

  @Column({ nullable: true })
  type2: string;

  @Column({ nullable: true, type: 'jsonb' })
  stats: {
    hp: number;
    attack: number;
    defense: number;
    spattack: number;
    spdefense: number;
    speed: number;
  };

  @Column({ nullable: true })
  species: string;

  @Column({ nullable: true, type: 'decimal' })
  height: number;

  @Column({ nullable: true, type: 'decimal' })
  weight: number;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true, type: 'decimal' })
  catchRate: number;

  @Column({ nullable: true })
  baseExp: number;

  @Column({ nullable: true })
  eggCycles: number;

  @Column({ nullable: true })
  friendship: number;

  @Column({ nullable: true })
  growthRate: string;

  @Column({ nullable: true, type: 'jsonb' })
  evYield: {
    hp?: number;
    attack?: number;
    defense?: number;
    spattack?: number;
    spdefense?: number;
    speed?: number;
  };

  @Column({ nullable: true })
  spriteUrl: string;

  @OneToMany(() => ProfilePokemon, (pp) => pp.pokemon)
  pokemons: ProfilePokemon[];
}