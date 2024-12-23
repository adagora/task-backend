import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { StarWarsResolver } from 'src/starwars/starwars.resolver';

@Injectable()
export class StarwarsScheduler implements OnApplicationBootstrap {
  private readonly logger = new Logger(StarwarsScheduler.name);

  constructor(private readonly starWarsResolver: StarWarsResolver) {}

  async onApplicationBootstrap() {
    try {
      await this.syncStarwarsData();
    } catch (error) {
      this.logger.error('Initial synchronization failed:', error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async syncStarwarsData() {
    this.logger.log('Data synchronization started');
    const tasks = [
      { name: 'films', action: () => this.starWarsResolver.films() },
      { name: 'species', action: () => this.starWarsResolver.species() },
      { name: 'vehicles', action: () => this.starWarsResolver.vehicles() },
      { name: 'starships', action: () => this.starWarsResolver.starships() },
      { name: 'planets', action: () => this.starWarsResolver.planets() },
    ];

    const results = await Promise.allSettled(
      tasks.map((task) =>
        task.action().catch((error) => {
          this.logger.error(`Failed to sync ${task.name}:`, error);
          throw error;
        }),
      ),
    );

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        this.logger.log(`${tasks[index].name} synced successfully.`);
      } else {
        this.logger.error(`${tasks[index].name} failed to sync.`);
      }
    });

    this.logger.log('Data synchronization complete.');
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
