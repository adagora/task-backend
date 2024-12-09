import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { StarWarsResolver } from 'src/starwars/starwars.resolver';

@Injectable()
export class StarwarsScheduler {
  private readonly logger = new Logger(StarwarsScheduler.name);
  constructor(private readonly starWarsResolver: StarWarsResolver) {}

  async OnApplicationBootstrap() {
    const timer = setTimeout(async () => {
      await Promise.all([
        this.starWarsResolver.films(),
        this.starWarsResolver.species(),
        this.starWarsResolver.vehicles(),
        this.starWarsResolver.starships(),
        this.starWarsResolver.planets(),
      ]);
      return () => {
        clearTimeout(timer);
      };
    }, 5000);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async syncStarwarsData() {
    try {
      await Promise.all([
        this.starWarsResolver.films(),
        this.starWarsResolver.species(),
        this.starWarsResolver.vehicles(),
        this.starWarsResolver.starships(),
        this.starWarsResolver.planets(),
      ]);
      this.logger.log('Star Wars data synchronized successfully');
    } catch (error) {
      this.logger.error('Error synchronizing Star Wars data:', error);
    }
  }
  async updateSpecificEntity(type: string, id: string) {
    try {
      let updatedEntity;
      switch (type.toLowerCase()) {
        case 'film':
          updatedEntity = await this.starWarsResolver.film(id);
          break;
        case 'species':
          updatedEntity = await this.starWarsResolver.speciesById(id);
          break;
        case 'vehicle':
          updatedEntity = await this.starWarsResolver.vehicle(id);
          break;
        case 'starship':
          updatedEntity = await this.starWarsResolver.starship(id);
          break;
        case 'planet':
          updatedEntity = await this.starWarsResolver.planet(id);
          break;
        default:
          throw new Error(`Invalid entity type: ${type}`);
      }

      this.logger.log(`${type} with ID ${id} updated successfully.`);
      return updatedEntity;
    } catch (error) {
      this.logger.error(`Error updating ${type} with ID ${id}:`, error);
      throw error;
    }
  }
}
