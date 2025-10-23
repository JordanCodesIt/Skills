import { Resolver, Mutation, Args, Int, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ArticleViewsService } from './article-views.service';
import { Article } from 'src/articles/entities/article.entity';
import { AuthGuard } from 'src/guard/auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Resolver(() => Article)
export class ArticleViewsResolver {
  constructor(private readonly articleViewsService: ArticleViewsService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Article)
  async viewArticle(
    @Args('articleId', { type: () => Int }) articleId: number,
    @CurrentUser() user: User,
  ) {
    const article = await this.articleViewsService.addView(articleId, user);
    const count = await this.articleViewsService.countViews(articleId);
    article.views = count;
    return article;
  }

  @Query(() => Int)
  async articleViewsCount(
    @Args('articleId', { type: () => Int }) articleId: number,
  ) {
    return this.articleViewsService.countViews(articleId);
  }
}
