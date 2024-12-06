import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class Pagination {
  @Field({ defaultValue: 1 })
  page: number;

  @Field({ defaultValue: 10 })
  perPage: number;
}

export const DefaultPagination: Pagination = {
  page: 1,
  perPage: 10,
};
