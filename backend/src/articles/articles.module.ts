import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesResolver } from './articles.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Tag } from 'src/tags/entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Tag])],
  providers: [ArticlesResolver, ArticlesService],
  exports: [ArticlesService],
})
export class ArticlesModule {}
