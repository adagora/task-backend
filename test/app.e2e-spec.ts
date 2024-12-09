import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { getApplication } from './utils/getApplication';
import {
  Film,
  Planet,
  Species,
  Starship,
  Vehicle,
} from 'src/starwars/starwars.entity';

describe('GraphQL API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await getApplication();
  });

  afterAll(async () => {
    await app.close();
  });

  const graphqlEndpoint = '/graphql';

  it('should fetch all films', async () => {
    const query = `
      query {
        films {
          title
          episode_id
          director
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post(graphqlEndpoint)
      .send({ query });

    expect(response.status).toBe(200);
    const films = response.body.data.films;

    expect(Array.isArray(films)).toBe(true);
    films.forEach((film: Film) => {
      expect(film).toHaveProperty('title');
      expect(film).toHaveProperty('episode_id');
      expect(film).toHaveProperty('director');
    });
  });

  it('should fetch films with filters', async () => {
    const query = `
      query {
        films(filter: { director: "George Lucas" }) {
          title
          director
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post(graphqlEndpoint)
      .send({ query });

    expect(response.status).toBe(200);
    const films = response.body.data.films;

    expect(Array.isArray(films)).toBe(true);
    films.forEach((film: Film) => {
      expect(film.director).toContain('George Lucas');
    });
  });

  it('should fetch all species', async () => {
    const query = `
      query {
        species {
          name
          classification
          language
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post(graphqlEndpoint)
      .send({ query });

    expect(response.status).toBe(200);
    const species = response.body.data.species;

    expect(Array.isArray(species)).toBe(true);
    species.forEach((item: Species) => {
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('classification');
      expect(item).toHaveProperty('language');
    });
  });

  it('should analyze opening crawl', async () => {
    const query = `
      query {
        analyzeOpeningCrawl {
          uniqueWordPairs {
            word
            count
          }
          mostMentionedCharacters
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post(graphqlEndpoint)
      .send({ query });

    expect(response.status).toBe(200);
    const analysis = response.body.data.analyzeOpeningCrawl;

    expect(analysis).toHaveProperty('uniqueWordPairs');
    expect(analysis).toHaveProperty('mostMentionedCharacters');

    expect(Array.isArray(analysis.uniqueWordPairs)).toBe(true);
    expect(Array.isArray(analysis.mostMentionedCharacters)).toBe(true);
  });

  it('should fetch films with pagination', async () => {
    const query = `
      query {
        films(pagination: { page: 1 }) {
          title
          episode_id
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post(graphqlEndpoint)
      .send({ query });

    expect(response.status).toBe(200);
    const films = response.body.data.films;

    expect(Array.isArray(films)).toBe(true);
    expect(films.length).toBeGreaterThan(0);
  });

  it('should fetch all vehicles', async () => {
    const query = `
      query {
        vehicles {
          name
          model
          manufacturer
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post(graphqlEndpoint)
      .send({ query });

    expect(response.status).toBe(200);
    const vehicles = response.body.data.vehicles;

    expect(Array.isArray(vehicles)).toBe(true);
    vehicles.forEach((vehicle: Vehicle) => {
      expect(vehicle).toHaveProperty('name');
      expect(vehicle).toHaveProperty('model');
      expect(vehicle).toHaveProperty('manufacturer');
    });
  });

  it('should fetch vehicles with filters', async () => {
    const query = `
      query {
        vehicles(filter: { manufacturer: "Corellia" }) {
          name
          manufacturer
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post(graphqlEndpoint)
      .send({ query });

    expect(response.status).toBe(200);
    const vehicles = response.body.data.vehicles;

    expect(Array.isArray(vehicles)).toBe(true);
    vehicles.forEach((vehicle: Vehicle) => {
      expect(vehicle.manufacturer).toContain('Corellia');
    });
  });

  it('should fetch all starships', async () => {
    const query = `
      query {
        starships {
          name
          model
          starship_class
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post(graphqlEndpoint)
      .send({ query });

    expect(response.status).toBe(200);
    const starships = response.body.data.starships;

    expect(Array.isArray(starships)).toBe(true);
    starships.forEach((starship: Starship) => {
      expect(starship).toHaveProperty('name');
      expect(starship).toHaveProperty('model');
      expect(starship).toHaveProperty('starship_class');
    });
  });

  it('should fetch starships with filters', async () => {
    const query = `
      query {
        starships(filter: { starship_class: "Fighter" }) {
          name
          starship_class
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post(graphqlEndpoint)
      .send({ query });

    expect(response.status).toBe(200);
    const starships = response.body.data.starships;

    expect(Array.isArray(starships)).toBe(true);
    starships.forEach((starship: Starship) => {
      expect(starship.starship_class).toContain('Fighter');
    });
  });

  it('should fetch all planets', async () => {
    const query = `
      query {
        planets {
          name
          climate
          terrain
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post(graphqlEndpoint)
      .send({ query });

    expect(response.status).toBe(200);
    const planets = response.body.data.planets;

    expect(Array.isArray(planets)).toBe(true);
    planets.forEach((planet: Planet) => {
      expect(planet).toHaveProperty('name');
      expect(planet).toHaveProperty('climate');
      expect(planet).toHaveProperty('terrain');
    });
  });

  it('should fetch planets with filters', async () => {
    const query = `
      query {
        planets(filter: { climate: "temperate" }) {
          name
          climate
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post(graphqlEndpoint)
      .send({ query });

    expect(response.status).toBe(200);
    const planets = response.body.data.planets;

    expect(Array.isArray(planets)).toBe(true);
    planets.forEach((planet: Planet) => {
      expect(planet.climate).toContain('temperate');
    });
  });

  it('should return empty array for non-matching film filter', async () => {
    const query = `
      query {
        films(filter: { title: "Non-existent Title" }) {
          title
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post(graphqlEndpoint)
      .send({ query });

    expect(response.status).toBe(200);
    const films = response.body.data.films;

    expect(Array.isArray(films)).toBe(true);
    expect(films.length).toBe(0);
  });

  it('should handle invalid query gracefully', async () => {
    const query = `
      query {
        invalidQuery {
          id
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post(graphqlEndpoint)
      .send({ query });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});
