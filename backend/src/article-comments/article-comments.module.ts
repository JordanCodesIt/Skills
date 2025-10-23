import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleComment } from './entities/article-comment.entity';
import { Article } from 'src/articles/entities/article.entity';
import { ArticleCommentsService } from './article-comments.service';
import { ArticleCommentsResolver } from './article-comments.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleComment, Article])],
  providers: [ArticleCommentsService, ArticleCommentsResolver],
})
export class ArticleCommentsModule {}
