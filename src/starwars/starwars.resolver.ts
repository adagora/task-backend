import { Query, Resolver, Args, ID, ObjectType } from '@nestjs/graphql';
import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
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
import {
  Pagination,
  DefaultPagination,
  Paginated,
} from '../utils/pagination.gql-type';
import { StarWarsApiResponse } from 'src/starwars/client/starwars-api-query-response.type';
import { CrawlAnalysisResult } from 'src/utils/analysis.gql-type';
import { GraphQLCacheInterceptor } from 'src/interceptors/cache.interceptor';

@ObjectType()
class PaginatedFilms extends Paginated(Film) {}

@ObjectType()
class PaginatedSpecies extends Paginated(Species) {}

@ObjectType()
class PaginatedVehicles extends Paginated(Vehicle) {}

@ObjectType()
class PaginatedStarships extends Paginated(Starship) {}

@ObjectType()
class PaginatedPlanets extends Paginated(Planet) {}

@Resolver()
@UseInterceptors(GraphQLCacheInterceptor)
export class StarWarsResolver {
  private readonly baseUrl = 'https://swapi.py4e.com/api';
  constructor(private readonly httpService: HttpService) {}

  private async fetchAllPages<T>(
    endpoint: string,
    filterFn?: (item: T) => boolean,
  ): Promise<T[]> {
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
  }

  private paginateResults<T>(items: T[], pagination?: Pagination) {
    if (!pagination?.page || !pagination?.perPage) {
      return {
        items: items,
        pagination: null,
      };
    }

    const startIndex = (pagination.page - 1) * pagination.perPage;
    const endIndex = startIndex + pagination.perPage;
    const paginatedItems = items.slice(startIndex, endIndex);

    return {
      items: paginatedItems,
      pagination: {
        currentPage: pagination.page,
        perPage: pagination.perPage,
        totalItems: items.length,
        totalPages: Math.ceil(items.length / pagination.perPage),
        hasNextPage: endIndex < items.length,
        hasPreviousPage: pagination.page > 1,
      },
    };
  }

  @Query(() => PaginatedFilms || Film)
  async films(
    @Args('pagination', { nullable: true }) pagination?: Pagination,
    @Args('filter', { nullable: true }) filter?: FilmFilter,
  ): Promise<PaginatedFilms> {
    const allFilms = await this.fetchAllPages<Film>('films', (film) => {
      return (
        (!filter?.title ||
          film.title.toLowerCase().includes(filter.title.toLowerCase())) &&
        (!filter?.episode_id || film.episode_id === filter.episode_id) &&
        (!filter?.director ||
          film.director.toLowerCase().includes(filter.director.toLowerCase()))
      );
    });

    return this.paginateResults(allFilms, pagination);
  }

  @Query(() => Film)
  async film(@Args('id', { type: () => ID }) id: string): Promise<Film> {
    if (!id) {
      throw new BadRequestException('Film ID must be provided.');
    }

    const response = await firstValueFrom(
      this.httpService.get<Film>(`${this.baseUrl}/films/${id}`),
    );
    return response.data;
  }

  @Query(() => PaginatedSpecies)
  async species(
    @Args('pagination', { nullable: true }) pagination?: Pagination,
    @Args('filter', { nullable: true }) filter?: SpeciesFilter,
  ): Promise<PaginatedSpecies> {
    const allSpecies = await this.fetchAllPages<Species>(
      'species',
      (species) => {
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
      },
    );

    return this.paginateResults(allSpecies, pagination);
  }

  @Query(() => Species)
  async speciesById(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Species> {
    if (!id) {
      throw new BadRequestException('Species ID must be provided.');
    }

    const response = await firstValueFrom(
      this.httpService.get<Species>(`${this.baseUrl}/species/${id}`),
    );
    return response.data;
  }

  @Query(() => PaginatedVehicles)
  async vehicles(
    @Args('pagination', { nullable: true }) pagination?: Pagination,
    @Args('filter', { nullable: true }) filter?: VehicleFilter,
  ): Promise<PaginatedVehicles> {
    const allVehicles = await this.fetchAllPages<Vehicle>(
      'vehicles',
      (vehicle) => {
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
      },
    );

    return this.paginateResults(allVehicles, pagination);
  }

  @Query(() => Vehicle)
  async vehicle(@Args('id', { type: () => ID }) id: string): Promise<Vehicle> {
    if (!id) {
      throw new BadRequestException('Vehicle ID must be provided.');
    }

    const response = await firstValueFrom(
      this.httpService.get<Vehicle>(`${this.baseUrl}/vehicles/${id}`),
    );

    this.handleNotFound(response.data, id, 'Vehicle');
    return response.data;
  }

  @Query(() => PaginatedStarships)
  async starships(
    @Args('pagination', { nullable: true }) pagination?: Pagination,
    @Args('filter', { nullable: true }) filter?: StarshipFilter,
  ): Promise<PaginatedStarships> {
    const allStarships = await this.fetchAllPages<Starship>(
      'starships',
      (starship) => {
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
      },
    );

    return this.paginateResults(allStarships, pagination);
  }

  @Query(() => Starship)
  async starship(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Starship> {
    if (!id) {
      throw new BadRequestException('Starship ID must be provided.');
    }

    const response = await firstValueFrom(
      this.httpService.get<Starship>(`${this.baseUrl}/starships/${id}`),
    );

    this.handleNotFound(response.data, id, 'Starship');
    return response.data;
  }

  @Query(() => PaginatedPlanets)
  async planets(
    @Args('pagination', { nullable: true }) pagination?: Pagination,
    @Args('filter', { nullable: true }) filter?: PlanetFilter,
  ): Promise<PaginatedPlanets> {
    const allPlanets = await this.fetchAllPages<Planet>('planets', (planet) => {
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

    return this.paginateResults(allPlanets, pagination);
  }

  @Query(() => Planet)
  async planet(@Args('id', { type: () => ID }) id: string): Promise<Planet> {
    if (!id) {
      throw new BadRequestException('Planet ID must be provided.');
    }

    const response = await firstValueFrom(
      this.httpService.get<Planet>(`${this.baseUrl}/planets/${id}`),
    );

    this.handleNotFound(response.data, id, 'Planet');
    return response.data;
  }

  private async getAllCharacters(): Promise<Character[]> {
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
  }

  @Query(() => CrawlAnalysisResult)
  async analyzeOpeningCrawl(): Promise<CrawlAnalysisResult> {
    const filmsResponse = await this.films(DefaultPagination);
    const films = filmsResponse.items as Film[];

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

  private handleNotFound(data: unknown, id: string, entity: string): void {
    if (!data) {
      throw new NotFoundException(`${entity} with id ${id} not found.`);
    }
  }
}
