import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CreateArticleCommentInput {
  @Field()
  @IsNotEmpty()
  content: string;

  @Field(() => Int)
  @IsNotEmpty()
  articleId: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  parentCommentId?: number;
}
