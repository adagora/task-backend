import { Type } from '@nestjs/common';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class Pagination {
  @Field(() => Number, {
    defaultValue: 1,
    description: 'Page number (1-based)',
  })
  page: number;

  @Field(() => Number, { defaultValue: 10, description: 'Items per page' })
  perPage: number;
}

export const DefaultPagination: Pagination = {
  page: 1,
  perPage: 10,
};

@ObjectType()
export class PaginationInfo {
  @Field(() => Number, { description: 'Current page number' })
  currentPage: number;

  @Field(() => Number, { description: 'Number of items per page' })
  perPage: number;

  @Field(() => Number, { description: 'Total number of items' })
  totalItems: number;

  @Field(() => Number, { description: 'Total number of pages' })
  totalPages: number;

  @Field(() => Boolean, { description: 'Whether there is a next page' })
  hasNextPage: boolean;

  @Field(() => Boolean, { description: 'Whether there is a previous page' })
  hasPreviousPage: boolean;
}

export function Paginated<T>(classRef: Type<T>) {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType {
    @Field(() => [classRef], {
      description: 'List of items on the current page',
    })
    items: T[];

    @Field(() => PaginationInfo, {
      description: 'Pagination metadata',
      nullable: true,
    })
    pagination: PaginationInfo | null;
  }
  return PaginatedType;
}
