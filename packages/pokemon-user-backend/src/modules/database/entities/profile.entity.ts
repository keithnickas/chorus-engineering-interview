import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { ProfilePokemon } from './profile-pokemon.entity';
import { UUID } from 'node:crypto';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number

  @Unique(['uid'])
  @Column({ type: 'uuid', unique: true, generated: 'uuid' })
  uid: UUID

  @Column()
  name: string

  @Column({ nullable: true })
  description: string

  @Column()
  email: string
  
  @OneToMany(() => ProfilePokemon, (profilePokemon) => profilePokemon.profile, { cascade: true })
  pokemons: ProfilePokemon[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
  }