import { InputType, Field, Int } from '@nestjs/graphql';
import { IsEnum, IsInt } from 'class-validator';
import { ReactionType } from '../entities/article-reaction.entity';

@InputType()
export class CreateArticleReactionInput {
  @Field(() => Int)
  @IsInt()
  articleId: number;

  @Field(() => ReactionType)
  @IsEnum(ReactionType)
  type: ReactionType;
}
