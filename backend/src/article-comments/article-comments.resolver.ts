import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ArticleCommentsService } from './article-comments.service';
import { ArticleComment } from './entities/article-comment.entity';
import { CreateArticleCommentInput } from './dto/create-article-comment.input';
import { UpdateArticleCommentInput } from './dto/update-article-comment.input';

@Resolver(() => ArticleComment)
export class ArticleCommentsResolver {
  constructor(private readonly articleCommentsService: ArticleCommentsService) {}

  @Mutation(() => ArticleComment)
  createArticleComment(@Args('createArticleCommentInput') createArticleCommentInput: CreateArticleCommentInput) {
    return this.articleCommentsService.create(createArticleCommentInput);
  }

  @Query(() => [ArticleComment], { name: 'articleComments' })
  findAll() {
    return this.articleCommentsService.findAll();
  }

  @Query(() => ArticleComment, { name: 'articleComment' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.articleCommentsService.findOne(id);
  }

  @Mutation(() => ArticleComment)
  updateArticleComment(@Args('updateArticleCommentInput') updateArticleCommentInput: UpdateArticleCommentInput) {
    return this.articleCommentsService.update(updateArticleCommentInput.id, updateArticleCommentInput);
  }

  @Mutation(() => ArticleComment)
  removeArticleComment(@Args('id', { type: () => Int }) id: number) {
    return this.articleCommentsService.remove(id);
  }
}
