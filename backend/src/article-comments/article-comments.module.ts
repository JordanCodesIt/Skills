import { Module } from '@nestjs/common';
import { ArticleCommentsService } from './article-comments.service';
import { ArticleCommentsResolver } from './article-comments.resolver';

@Module({
  providers: [ArticleCommentsResolver, ArticleCommentsService],
})
export class ArticleCommentsModule {}
