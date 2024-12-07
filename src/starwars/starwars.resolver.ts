import { Query, Resolver, Args, ID } from '@nestjs/graphql';
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  Film,
  Species,
  Vehicle,
  Starship,
  Planet,
  FilmFilter,
  SpeciesFilter,
  VehicleFilter,
  StarshipFilter,
  PlanetFilter,
} from './starwars.entity';
import { Pagination } from '../utils/pagination.gql-type';
import { StarWarsApiResponse } from 'src/starwars/client/starwars-api-query-response.type';
import { RedisCache } from 'cache-manager-redis-yet';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Resolver()
export class StarWarsResolver {
  private readonly baseUrl = 'https://swapi.dev/api';

  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: RedisCache,
  ) {}

  private handleNotFound(data: unknown, id: string, entity: string): void {
    if (!data) {
      throw new NotFoundException(`${entity} with id ${id} not found.`);
    }
  }

  private handlePageNotFound(
    data: { results?: unknown[] },
    page: number,
    entity: string,
  ): void {
    if (!data || !Array.isArray(data.results)) {
      throw new NotFoundException(`No ${entity} found for page ${page}.`);
    }
  }

  private async getCachedData<T>(
    cacheKey: string,
    fetchData: () => Promise<T>,
  ): Promise<T> {
    const cachedData = await this.cacheManager.get<T>(cacheKey);

    if (cachedData) {
      console.log(`Cache hit for key: ${cacheKey}`);
      return cachedData;
    }

    console.log(`Cache miss for key: ${cacheKey}. Fetching from API.`);
    const data = await fetchData();

    if (!data) {
      throw new NotFoundException(`Data not found for key: ${cacheKey}`);
    }

    await this.cacheManager.set(
      cacheKey,
      data,
      parseInt(process.env.CACHE_DEFAULT_TTL!),
    );
    return data;
  }

  @Query(() => Film)
  async film(@Args('id', { type: () => ID }) id: string): Promise<Film> {
    if (!id) {
      throw new BadRequestException('Film ID must be provided.');
    }
    const cacheKey = `films_${id}`;

    return this.getCachedData(cacheKey, async () => {
      const response = await firstValueFrom(
        this.httpService.get<Film>(`${this.baseUrl}/films/${id}`),
      );
      return response.data;
    });
  }

  @Query(() => [Film])
  async films(
    @Args('pagination') pagination: Pagination,
    @Args('filter', { nullable: true }) filter?: FilmFilter,
  ): Promise<Film[]> {
    if (!pagination || !pagination.page) {
      throw new BadRequestException(
        'Pagination must be provided with a valid page number.',
      );
    }

    const cacheKey = `films_page_${pagination.page}`;
    return this.getCachedData(cacheKey, async () => {
      const response = await firstValueFrom(
        this.httpService.get<StarWarsApiResponse<Film>>(
          `${this.baseUrl}/films/?page=${pagination.page}`,
        ),
      );

      const results = response.data.results;

      if (!results) {
        throw new NotFoundException(
          `No films found for page ${pagination.page}.`,
        );
      }

      return filter
        ? results.filter((film) => {
            return (
              (!filter.title ||
                film.title
                  .toLowerCase()
                  .includes(filter.title.toLowerCase())) &&
              (!filter.episode_id || film.episode_id === filter.episode_id) &&
              (!filter.director ||
                film.director
                  .toLowerCase()
                  .includes(filter.director.toLowerCase()))
            );
          })
        : results;
    });
  }

  @Query(() => Species)
  async speciesById(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Species> {
    if (!id) {
      throw new BadRequestException('Species ID must be provided.');
    }

    const cacheKey = `species_${id}`;
    return this.getCachedData(cacheKey, async () => {
      const response = await firstValueFrom(
        this.httpService.get<Species>(`${this.baseUrl}/species/${id}`),
      );
      return response.data;
    });
  }

  @Query(() => [Species])
  async species(
    @Args('pagination') pagination: Pagination,
    @Args('filter', { nullable: true }) filter?: SpeciesFilter,
  ): Promise<Species[]> {
    if (!pagination || !pagination.page) {
      throw new BadRequestException(
        'Pagination must be provided with a valid page number.',
      );
    }

    const cacheKey = `species_page_${pagination.page}`;
    return this.getCachedData(cacheKey, async () => {
      const response = await firstValueFrom(
        this.httpService.get<StarWarsApiResponse<Species>>(
          `${this.baseUrl}/species/?page=${pagination.page}`,
        ),
      );

      const results = response.data.results;

      if (!results) {
        throw new NotFoundException(
          `No species found for page ${pagination.page}.`,
        );
      }

      return filter
        ? results.filter((species) => {
            return (
              (!filter.name ||
                species.name
                  .toLowerCase()
                  .includes(filter.name.toLowerCase())) &&
              (!filter.classification ||
                species.classification
                  .toLowerCase()
                  .includes(filter.classification.toLowerCase())) &&
              (!filter.language ||
                species.language
                  .toLowerCase()
                  .includes(filter.language.toLowerCase()))
            );
          })
        : results;
    });
  }

  @Query(() => Vehicle)
  async vehicle(@Args('id', { type: () => ID }) id: string): Promise<Vehicle> {
    if (!id) {
      throw new BadRequestException('Vehicle ID must be provided.');
    }
    const cacheKey = `vehicles_${id}`;
    return this.getCachedData(cacheKey, async () => {
      const response = await firstValueFrom(
        this.httpService.get<Vehicle>(`${this.baseUrl}/vehicles/${id}`),
      );

      this.handleNotFound(response.data, id, 'Vehicle');
      return response.data;
    });
  }

  @Query(() => [Vehicle])
  async vehicles(
    @Args('pagination') pagination: Pagination,
    @Args('filter', { nullable: true }) filter?: VehicleFilter,
  ): Promise<Vehicle[]> {
    if (!pagination || !pagination.page) {
      throw new BadRequestException(
        'Pagination must be provided with a valid page number.',
      );
    }
    const cacheKey = `vehicles_page_${pagination.page}`;
    return this.getCachedData(cacheKey, async () => {
      const response = await firstValueFrom(
        this.httpService.get<StarWarsApiResponse<Vehicle>>(
          `${this.baseUrl}/vehicles/?page=${pagination.page}`,
        ),
      );

      this.handlePageNotFound(response.data, pagination.page, 'vehicles');

      let results = response.data.results;

      if (filter) {
        results = results.filter((vehicle) => {
          return (
            (!filter.name ||
              vehicle.name.toLowerCase().includes(filter.name.toLowerCase())) &&
            (!filter.model ||
              vehicle.model
                .toLowerCase()
                .includes(filter.model.toLowerCase())) &&
            (!filter.manufacturer ||
              vehicle.manufacturer
                .toLowerCase()
                .includes(filter.manufacturer.toLowerCase()))
          );
        });
      }

      return results;
    });
  }

  @Query(() => Starship)
  async starship(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Starship> {
    if (!id) {
      throw new BadRequestException('Starship ID must be provided.');
    }
    const cacheKey = `starships_${id}`;
    return this.getCachedData(cacheKey, async () => {
      const response = await firstValueFrom(
        this.httpService.get<Starship>(`${this.baseUrl}/starships/${id}`),
      );

      this.handleNotFound(response.data, id, 'Starship');
      return response.data;
    });
  }

  @Query(() => [Starship])
  async starships(
    @Args('pagination') pagination: Pagination,
    @Args('filter', { nullable: true }) filter?: StarshipFilter,
  ): Promise<Starship[]> {
    if (!pagination || !pagination.page) {
      throw new BadRequestException(
        'Pagination must be provided with a valid page number.',
      );
    }
    const cacheKey = `starships_page_${pagination.page}`;

    return this.getCachedData(cacheKey, async () => {
      const response = await firstValueFrom(
        this.httpService.get<StarWarsApiResponse<Starship>>(
          `${this.baseUrl}/starships/?page=${pagination.page}`,
        ),
      );

      this.handlePageNotFound(response.data, pagination.page, 'starships');

      let results = response.data.results;

      if (filter) {
        results = results.filter((starship) => {
          return (
            (!filter.name ||
              starship.name
                .toLowerCase()
                .includes(filter.name.toLowerCase())) &&
            (!filter.model ||
              starship.model
                .toLowerCase()
                .includes(filter.model.toLowerCase())) &&
            (!filter.starship_class ||
              starship.starship_class
                .toLowerCase()
                .includes(filter.starship_class.toLowerCase()))
          );
        });
      }

      return results;
    });
  }

  @Query(() => Planet)
  async planet(@Args('id', { type: () => ID }) id: string): Promise<Planet> {
    if (!id) {
      throw new BadRequestException('Planet ID must be provided.');
    }

    const cacheKey = `planets_${id}`;
    return this.getCachedData(cacheKey, async () => {
      const response = await firstValueFrom(
        this.httpService.get<Planet>(`${this.baseUrl}/planets/${id}`),
      );

      this.handleNotFound(response.data, id, 'Planet');
      return response.data;
    });
  }

  @Query(() => [Planet])
  async planets(
    @Args('pagination') pagination: Pagination,
    @Args('filter', { nullable: true }) filter?: PlanetFilter,
  ): Promise<Planet[]> {
    if (!pagination || !pagination.page) {
      throw new BadRequestException(
        'Pagination must be provided with a valid page number.',
      );
    }

    const cacheKey = `planets_page_${pagination.page}`;
    return this.getCachedData(cacheKey, async () => {
      const response = await firstValueFrom(
        this.httpService.get<StarWarsApiResponse<Planet>>(
          `${this.baseUrl}/planets/?page=${pagination.page}`,
        ),
      );

      this.handlePageNotFound(response.data, pagination.page, 'planets');

      let results = response.data.results;

      if (filter) {
        results = results.filter((planet) => {
          return (
            (!filter.name ||
              planet.name.toLowerCase().includes(filter.name.toLowerCase())) &&
            (!filter.climate ||
              planet.climate
                .toLowerCase()
                .includes(filter.climate.toLowerCase())) &&
            (!filter.terrain ||
              planet.terrain
                .toLowerCase()
                .includes(filter.terrain.toLowerCase()))
          );
        });
      }

      return results;
    });
  }
}
