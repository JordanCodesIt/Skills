import { Module } from '@nestjs/common';
import { ArticleReactionsService } from './article-reactions.service';
import { ArticleReactionsResolver } from './article-reactions.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleReaction } from './entities/article-reaction.entity';
import { Article } from 'src/articles/entities/article.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleReaction, Article])],
  providers: [ArticleReactionsResolver, ArticleReactionsService],
})
export class ArticleReactionsModule {}
