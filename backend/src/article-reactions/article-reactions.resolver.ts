import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ArticleReactionsService } from './article-reactions.service';
import { ArticleReaction } from './entities/article-reaction.entity';
import { CreateArticleReactionInput } from './dto/create-article-reaction.input';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guard/auth.guard';

@UseGuards(AuthGuard)
@Resolver(() => ArticleReaction)
export class ArticleReactionsResolver {
  constructor(
    private readonly articleReactionsService: ArticleReactionsService,
  ) {}

  @Mutation(() => ArticleReaction)
  createArticleReaction(
    @Args('createArticleReactionInput')
    createArticleReactionInput: CreateArticleReactionInput,
    @CurrentUser() user: User,
  ) {
    return this.articleReactionsService.create(
      createArticleReactionInput,
      user,
    );
  }

  @Mutation(() => ArticleReaction)
  removeArticleReaction(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: User,
  ) {
    return this.articleReactionsService.remove(id, user);
  }

  @Query(() => [ArticleReaction])
  reactionsByArticle(
    @Args('articleId', { type: () => Int }) articleId: number,
  ) {
    return this.articleReactionsService.findAllByArticle(articleId);
  }
}
