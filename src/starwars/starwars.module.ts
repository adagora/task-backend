import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { StarWarsResolver } from './starwars.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Film,
  Planet,
  Species,
  Starship,
  Vehicle,
} from 'src/starwars/starwars.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Film, Species, Vehicle, Starship, Planet]),
    HttpModule,
  ],
  providers: [StarWarsResolver],
})
export class StarWarsModule {}
