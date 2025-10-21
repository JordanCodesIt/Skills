import { CreateArticleCommentInput } from './create-article-comment.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateArticleCommentInput extends PartialType(CreateArticleCommentInput) {
  @Field(() => Int)
  id: number;
}
