import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1733700517991 implements MigrationInterface {
  name = 'SchemaUpdate1733700517991';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "character" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "height" integer NOT NULL, "mass" integer NOT NULL, "hair_color" character varying NOT NULL, "skin_color" character varying NOT NULL, "eye_color" character varying NOT NULL, "birth_year" character varying NOT NULL, "gender" character varying NOT NULL, "homeworld" character varying NOT NULL, "films" text array NOT NULL, "species" text array NOT NULL, "vehicles" text array NOT NULL, "starships" text array NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6c4aec48c564968be15078b8ae5" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "character"`);
  }
}
