import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1733593735429 implements MigrationInterface {
  name = 'SchemaUpdate1733593735429';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "film" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "episode_id" integer NOT NULL, "opening_crawl" character varying NOT NULL, "director" character varying NOT NULL, "producer" character varying NOT NULL, "release_date" character varying NOT NULL, "species" text NOT NULL, "starships" text NOT NULL, "vehicles" text NOT NULL, "characters" text NOT NULL, "planets" text NOT NULL, "url" character varying NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "edited" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_37ec0ffe0011ccbe438a65e3c6e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "species" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "classification" character varying NOT NULL, "designation" character varying NOT NULL, "average_height" character varying NOT NULL, "average_lifespan" character varying NOT NULL, "eye_colors" character varying NOT NULL, "hair_colors" character varying NOT NULL, "skin_colors" character varying NOT NULL, "language" character varying NOT NULL, "homeworld" character varying, "people" text NOT NULL, "films" text NOT NULL, "url" character varying NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "edited" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ae6a87f2423ba6c25dc43c32770" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "vehicle" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "model" character varying NOT NULL, "manufacturer" character varying NOT NULL, "cost_in_credits" character varying NOT NULL, "length" character varying NOT NULL, "max_atmosphering_speed" character varying NOT NULL, "crew" character varying NOT NULL, "passengers" character varying NOT NULL, "cargo_capacity" character varying NOT NULL, "consumables" character varying NOT NULL, "vehicle_class" character varying NOT NULL, "pilots" text NOT NULL, "films" text NOT NULL, "url" character varying NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "edited" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_187fa17ba39d367e5604b3d1ec9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "starship" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "model" character varying NOT NULL, "manufacturer" character varying NOT NULL, "cost_in_credits" character varying NOT NULL, "length" character varying NOT NULL, "max_atmosphering_speed" character varying NOT NULL, "crew" character varying NOT NULL, "passengers" character varying NOT NULL, "cargo_capacity" character varying NOT NULL, "consumables" character varying NOT NULL, "hyperdrive_rating" character varying NOT NULL, "mglt" character varying NOT NULL, "starship_class" character varying NOT NULL, "pilots" text NOT NULL, "films" text NOT NULL, "url" character varying NOT NULL, CONSTRAINT "PK_398cab92a55d977f03881dda8e1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "planet" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "diameter" character varying NOT NULL, "rotation_period" character varying NOT NULL, "orbital_period" character varying NOT NULL, "gravity" character varying NOT NULL, "population" character varying NOT NULL, "climate" character varying NOT NULL, "terrain" character varying NOT NULL, "surface_water" character varying NOT NULL, "residents" text NOT NULL, "films" text NOT NULL, "url" character varying NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "edited" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cb7506671ad0f19d6287ee4bfb7" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "planet"`);
    await queryRunner.query(`DROP TABLE "starship"`);
    await queryRunner.query(`DROP TABLE "vehicle"`);
    await queryRunner.query(`DROP TABLE "species"`);
    await queryRunner.query(`DROP TABLE "film"`);
  }
}
