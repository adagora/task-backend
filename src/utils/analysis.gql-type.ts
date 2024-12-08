import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CrawlAnalysisResult {
  @Field(() => [WordCount])
  uniqueWordPairs: WordCount[];

  @Field(() => [String])
  mostMentionedCharacters: string[];
}

@ObjectType()
export class WordCount {
  @Field()
  word: string;

  @Field(() => Int)
  count: number;
}
