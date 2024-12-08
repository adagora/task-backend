import { Field, InputType, ObjectType, Int, ID } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Film {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  title: string;

  @Column()
  @Field(() => Int)
  episode_id: number;

  @Column()
  @Field()
  opening_crawl: string;

  @Column()
  @Field()
  director: string;

  @Column()
  @Field()
  producer: string;

  @Column()
  @Field()
  release_date: string;

  @Column('simple-array')
  @Field(() => [String])
  species: string[];

  @Column('simple-array')
  @Field(() => [String])
  starships: string[];

  @Column('simple-array')
  @Field(() => [String])
  vehicles: string[];

  @Column('simple-array')
  @Field(() => [String])
  characters: string[];

  @Column('simple-array')
  @Field(() => [String])
  planets: string[];

  @Column()
  @Field()
  url: string;

  @CreateDateColumn()
  @Field()
  created: string;

  @CreateDateColumn()
  @Field()
  edited: string;
}

@Entity()
@ObjectType()
export class Species {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  classification: string;

  @Column()
  @Field()
  designation: string;

  @Column()
  @Field()
  average_height: string;

  @Column()
  @Field()
  average_lifespan: string;

  @Column()
  @Field()
  eye_colors: string;

  @Column()
  @Field()
  hair_colors: string;

  @Column()
  @Field()
  skin_colors: string;

  @Column()
  @Field()
  language: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  homeworld: string;

  @Column('simple-array')
  @Field(() => [String])
  people: string[];

  @Column('simple-array')
  @Field(() => [String])
  films: string[];

  @Column()
  @Field()
  url: string;

  @CreateDateColumn()
  @Field()
  created: string;

  @CreateDateColumn()
  @Field()
  edited: string;
}

@Entity()
@ObjectType()
export class Vehicle {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  model: string;

  @Column()
  @Field()
  manufacturer: string;

  @Column()
  @Field()
  cost_in_credits: string;

  @Column()
  @Field()
  length: string;

  @Column()
  @Field()
  max_atmosphering_speed: string;

  @Column()
  @Field()
  crew: string;

  @Column()
  @Field()
  passengers: string;

  @Column()
  @Field()
  cargo_capacity: string;

  @Column()
  @Field()
  consumables: string;

  @Column()
  @Field()
  vehicle_class: string;

  @Column('simple-array')
  @Field(() => [String])
  pilots: string[];

  @Column('simple-array')
  @Field(() => [String])
  films: string[];

  @Column()
  @Field()
  url: string;

  @CreateDateColumn()
  @Field()
  created: string;

  @CreateDateColumn()
  @Field()
  edited: string;
}

@Entity()
@ObjectType()
export class Starship {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  model: string;

  @Column()
  @Field()
  manufacturer: string;

  @Column()
  @Field()
  cost_in_credits: string;

  @Column()
  @Field()
  length: string;

  @Column()
  @Field()
  max_atmosphering_speed: string;

  @Column()
  @Field()
  crew: string;

  @Column()
  @Field()
  passengers: string;

  @Column()
  @Field()
  cargo_capacity: string;

  @Column()
  @Field()
  consumables: string;

  @Column()
  @Field()
  hyperdrive_rating: string;

  @Column()
  @Field()
  MGLT: string;

  @Column()
  @Field()
  starship_class: string;

  @Column('simple-array')
  @Field(() => [String])
  pilots: string[];

  @Column('simple-array')
  @Field(() => [String])
  films: string[];

  @Column()
  @Field()
  url: string;
}

@Entity()
@ObjectType()
export class Planet {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  diameter: string;

  @Column()
  @Field()
  rotation_period: string;

  @Column()
  @Field()
  orbital_period: string;

  @Column()
  @Field()
  gravity: string;

  @Column()
  @Field()
  population: string;

  @Column()
  @Field()
  climate: string;

  @Column()
  @Field()
  terrain: string;

  @Column()
  @Field()
  surface_water: string;

  @Column('simple-array')
  @Field(() => [String])
  residents: string[];

  @Column('simple-array')
  @Field(() => [String])
  films: string[];

  @Column()
  @Field()
  url: string;

  @CreateDateColumn()
  @Field()
  created: string;

  @CreateDateColumn()
  @Field()
  edited: string;
}

@InputType()
export class FilmFilter {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => Int, { nullable: true })
  episode_id?: number;

  @Field(() => String, { nullable: true })
  director?: string;
}

@InputType()
export class SpeciesFilter {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  classification?: string;

  @Field(() => String, { nullable: true })
  language?: string;
}

@InputType()
export class VehicleFilter {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  model?: string;

  @Field(() => String, { nullable: true })
  manufacturer?: string;
}

@InputType()
export class StarshipFilter {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  model?: string;

  @Field(() => String, { nullable: true })
  starship_class?: string;
}

@InputType()
export class PlanetFilter {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  climate?: string;

  @Field(() => String, { nullable: true })
  terrain?: string;
}

@Entity()
@ObjectType()
export class Character {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field(() => Int)
  height: number;

  @Column()
  @Field(() => Int)
  mass: number;

  @Column()
  @Field()
  hair_color: string;

  @Column()
  @Field()
  skin_color: string;

  @Column()
  @Field()
  eye_color: string;

  @Column()
  @Field()
  birth_year: string;

  @Column()
  @Field()
  gender: string;

  @Column()
  @Field()
  homeworld: string;

  @Column('text', { array: true })
  @Field(() => [String])
  films: string[];

  @Column('text', { array: true })
  @Field(() => [String])
  species: string[];

  @Column('text', { array: true })
  @Field(() => [String])
  vehicles: string[];

  @Column('text', { array: true })
  @Field(() => [String])
  starships: string[];

  @CreateDateColumn()
  @Field()
  created: Date;

  @UpdateDateColumn()
  @Field()
  updated: Date;
}
