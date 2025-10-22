import { Resolver, Mutation, Args, Int, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ArticleCommentsService } from './article-comments.service';
import { ArticleComment } from './entities/article-comment.entity';
import { CreateArticleCommentInput } from './dto/create-article-comment.input';
import { AuthGuard } from 'src/guard/auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Resolver(() => ArticleComment)
export class ArticleCommentsResolver {
  constructor(private readonly commentsService: ArticleCommentsService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => ArticleComment)
  async createComment(
    @Args('input') input: CreateArticleCommentInput,
    @CurrentUser() user: User,
  ) {
    return this.commentsService.create(input, user);
  }

  @Query(() => [ArticleComment])
  async commentsByArticle(
    @Args('articleId', { type: () => Int }) articleId: number,
  ) {
    return this.commentsService.findByArticle(articleId);
  }
}
