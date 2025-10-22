import { CreateArticleViewInput } from './create-article-view.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateArticleViewInput extends PartialType(CreateArticleViewInput) {
  @Field(() => Int)
  id: number;
}
