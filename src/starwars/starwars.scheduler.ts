import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class StarwarsScheduler {
  private readonly logger = new Logger(StarwarsScheduler.name);

  constructor() {}
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async syncStarwarsData() {
    try {
      this.logger.log('Star Wars data synchronized successfully');
    } catch (error) {
      this.logger.error('Error synchronizing Star Wars data:', error);
    }
  }
  async updateStarwars() {}
}
