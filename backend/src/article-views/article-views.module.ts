import { Module } from '@nestjs/common';
import { ArticleViewsService } from './article-views.service';
import { ArticleViewsResolver } from './article-views.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleView } from './entities/article-view.entity';
import { Article } from 'src/articles/entities/article.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleView, Article])],
  providers: [ArticleViewsResolver, ArticleViewsService],
  exports: [ArticleViewsService],
})
export class ArticleViewsModule {}
