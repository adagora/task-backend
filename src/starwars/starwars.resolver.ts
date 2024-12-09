import { Query, Resolver, Args } from '@nestjs/graphql';
import { HttpService } from '@nestjs/axios';
import { Inject } from '@nestjs/common';
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
  Character,
} from './starwars.entity';
import { Pagination } from '../utils/pagination.gql-type';
import { StarWarsApiResponse } from 'src/starwars/client/starwars-api-query-response.type';
import { RedisCache } from 'cache-manager-redis-yet';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CrawlAnalysisResult } from 'src/utils/analysis.gql-type';

/**
 * GraphQL Resolver for Star Wars API.
 * - Fetches data from SWAPI endpoints (films, species, vehicles, starships, and planets).
 * - Implements caching to optimize API requests.
 * - Provides pagination and filtering for queries.
 */
@Resolver()
export class StarWarsResolver {
  private readonly baseUrl = 'https://swapi.dev/api';

  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: RedisCache,
  ) {}

  private async fetchAllPages<T>(
    endpoint: string,
    filterFn?: (item: T) => boolean,
  ): Promise<T[]> {
    const cacheKey = `${endpoint}_all`;

    return this.getCachedData(cacheKey, async () => {
      let allItems: T[] = [];
      let nextUrl = `${this.baseUrl}/${endpoint}/`;

      while (nextUrl) {
        const response = await firstValueFrom(
          this.httpService.get<StarWarsApiResponse<T>>(nextUrl),
        );

        let pageResults = response.data.results;

        if (filterFn) {
          pageResults = pageResults.filter(filterFn);
        }

        allItems = [...allItems, ...pageResults];
        nextUrl = response.data.next as string;
      }

      return allItems;
    });
  }

  private async getCachedData<T>(
    cacheKey: string,
    fetchData: () => Promise<T>,
  ): Promise<T> {
    const cachedData = await this.cacheManager.get<T>(cacheKey);
    console.log('cache key:', cacheKey);

    if (cachedData) {
      console.log('cached data existed?: yes');
      return cachedData;
    }

    const data = await fetchData();

    await this.cacheManager.set(
      cacheKey,
      data,
      parseInt(process.env.CACHE_DEFAULT_TTL!),
    );
    return data;
  }

  @Query(() => [Film], { description: 'Fetch a list of Star Wars films.' })
  async films(
    @Args('pagination', { nullable: true }) pagination?: Pagination,
    @Args('filter', { nullable: true }) filter?: FilmFilter,
  ): Promise<Film[]> {
    if (!pagination || !pagination.page) {
      return this.fetchAllPages<Film>('films', (film) => {
        return (
          (!filter?.title ||
            film.title.toLowerCase().includes(filter.title.toLowerCase())) &&
          (!filter?.episode_id || film.episode_id === filter.episode_id) &&
          (!filter?.director ||
            film.director.toLowerCase().includes(filter.director.toLowerCase()))
        );
      });
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
        return [];
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

  @Query(() => [Species], { description: 'Fetch a list of Star Wars species.' })
  async species(
    @Args('pagination', { nullable: true }) pagination?: Pagination,
    @Args('filter', { nullable: true }) filter?: SpeciesFilter,
  ): Promise<Species[]> {
    if (!pagination || !pagination.page) {
      return this.fetchAllPages<Species>('species', (species) => {
        return (
          (!filter?.name ||
            species.name.toLowerCase().includes(filter.name.toLowerCase())) &&
          (!filter?.classification ||
            species.classification
              .toLowerCase()
              .includes(filter.classification.toLowerCase())) &&
          (!filter?.language ||
            species.language
              .toLowerCase()
              .includes(filter.language.toLowerCase()))
        );
      });
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
        return [];
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

  @Query(() => [Vehicle], {
    description: 'Fetch a list of Star Wars vehicles.',
  })
  async vehicles(
    @Args('pagination', { nullable: true }) pagination?: Pagination,
    @Args('filter', { nullable: true }) filter?: VehicleFilter,
  ): Promise<Vehicle[]> {
    if (!pagination || !pagination.page) {
      return this.fetchAllPages<Vehicle>('vehicles', (vehicle) => {
        return (
          (!filter?.name ||
            vehicle.name.toLowerCase().includes(filter.name.toLowerCase())) &&
          (!filter?.model ||
            vehicle.model.toLowerCase().includes(filter.model.toLowerCase())) &&
          (!filter?.manufacturer ||
            vehicle.manufacturer
              .toLowerCase()
              .includes(filter.manufacturer.toLowerCase()))
        );
      });
    }

    const cacheKey = `vehicles_page_${pagination.page}`;
    return this.getCachedData(cacheKey, async () => {
      const response = await firstValueFrom(
        this.httpService.get<StarWarsApiResponse<Vehicle>>(
          `${this.baseUrl}/vehicles/?page=${pagination.page}`,
        ),
      );

      const results = response.data.results;

      if (!results) {
        return [];
      }

      return filter
        ? results.filter((vehicle) => {
            return (
              (!filter.name ||
                vehicle.name
                  .toLowerCase()
                  .includes(filter.name.toLowerCase())) &&
              (!filter.model ||
                vehicle.model
                  .toLowerCase()
                  .includes(filter.model.toLowerCase())) &&
              (!filter.manufacturer ||
                vehicle.manufacturer
                  .toLowerCase()
                  .includes(filter.manufacturer.toLowerCase()))
            );
          })
        : results;
    });
  }

  @Query(() => [Starship], {
    description: 'Fetch a list of Star Wars starships.',
  })
  async starships(
    @Args('pagination', { nullable: true }) pagination?: Pagination,
    @Args('filter', { nullable: true }) filter?: StarshipFilter,
  ): Promise<Starship[]> {
    if (!pagination || !pagination.page) {
      return this.fetchAllPages<Starship>('starships', (starship) => {
        return (
          (!filter?.name ||
            starship.name.toLowerCase().includes(filter.name.toLowerCase())) &&
          (!filter?.model ||
            starship.model
              .toLowerCase()
              .includes(filter.model.toLowerCase())) &&
          (!filter?.starship_class ||
            starship.starship_class
              .toLowerCase()
              .includes(filter.starship_class.toLowerCase()))
        );
      });
    }

    const cacheKey = `starships_page_${pagination.page}`;
    return this.getCachedData(cacheKey, async () => {
      const response = await firstValueFrom(
        this.httpService.get<StarWarsApiResponse<Starship>>(
          `${this.baseUrl}/starships/?page=${pagination.page}`,
        ),
      );

      const results = response.data.results;

      if (!results) {
        return [];
      }

      return filter
        ? results.filter((starship) => {
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
          })
        : results;
    });
  }

  @Query(() => [Planet], { description: 'Fetch a list of Star Wars planets.' })
  async planets(
    @Args('pagination', { nullable: true }) pagination?: Pagination,
    @Args('filter', { nullable: true }) filter?: PlanetFilter,
  ): Promise<Planet[]> {
    if (!pagination || !pagination.page) {
      return this.fetchAllPages<Planet>('planets', (planet) => {
        return (
          (!filter?.name ||
            planet.name.toLowerCase().includes(filter.name.toLowerCase())) &&
          (!filter?.climate ||
            planet.climate
              .toLowerCase()
              .includes(filter.climate.toLowerCase())) &&
          (!filter?.terrain ||
            planet.terrain.toLowerCase().includes(filter.terrain.toLowerCase()))
        );
      });
    }

    const cacheKey = `planets_page_${pagination.page}`;
    return this.getCachedData(cacheKey, async () => {
      const response = await firstValueFrom(
        this.httpService.get<StarWarsApiResponse<Planet>>(
          `${this.baseUrl}/planets/?page=${pagination.page}`,
        ),
      );

      const results = response.data.results;

      if (!results) {
        return [];
      }

      return filter
        ? results.filter((planet) => {
            return (
              (!filter.name ||
                planet.name
                  .toLowerCase()
                  .includes(filter.name.toLowerCase())) &&
              (!filter.climate ||
                planet.climate
                  .toLowerCase()
                  .includes(filter.climate.toLowerCase())) &&
              (!filter.terrain ||
                planet.terrain
                  .toLowerCase()
                  .includes(filter.terrain.toLowerCase()))
            );
          })
        : results;
    });
  }

  private async getAllCharacters(): Promise<Character[]> {
    const cacheKey = `characters_all`;
    return this.getCachedData(cacheKey, async () => {
      let allCharacters: Character[] = [];
      let nextUrl = `${this.baseUrl}/people/`;

      while (nextUrl) {
        const response = await firstValueFrom(
          this.httpService.get<StarWarsApiResponse<Character>>(nextUrl),
        );
        allCharacters = [...allCharacters, ...response.data.results];
        nextUrl = response.data.next as string;
      }
      return allCharacters;
    });
  }

  /**
   * Analyze the opening crawl of Star Wars films.
   *
   * - Counts unique words in the opening crawl texts.
   * - Identifies the most mentioned characters in the opening crawls.
   *
   * @returns An analysis result containing unique word counts and the most mentioned characters.
   */
  @Query(() => CrawlAnalysisResult, {
    description: 'Analyze the opening crawl of Star Wars films.',
  })
  async analyzeOpeningCrawl(): Promise<CrawlAnalysisResult> {
    const films = await this.films();

    const characters = await this.getAllCharacters();

    const combinedText = films
      .map((film) => film.opening_crawl)
      .join(' ')
      .toLowerCase();

    const wordCounts = new Map<string, number>();
    const words = combinedText.match(/\b\w+\b/g) || [];
    for (const word of words) {
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
    }
    const uniqueWordPairs = Array.from(wordCounts.entries()).map(
      ([word, count]) => ({
        word,
        count,
      }),
    );

    const characterCounts = new Map<string, number>();
    for (const character of characters) {
      const name = character.name.toLowerCase();
      const regex = new RegExp(`\\b${name}\\b`, 'g');
      const count = (combinedText.match(regex) || []).length;
      if (count > 0) {
        characterCounts.set(character.name, count);
      }
    }

    const maxCount = Math.max(...Array.from(characterCounts.values()));
    const mostMentionedCharacters = Array.from(characterCounts.entries())
      /* eslint-disable @typescript-eslint/no-unused-vars */
      .filter(([_, count]) => count === maxCount)
      .map(([name]) => name);

    return {
      uniqueWordPairs,
      mostMentionedCharacters,
    };
  }
}
