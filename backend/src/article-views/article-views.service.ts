import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleView } from './entities/article-view.entity';
import { Article } from 'src/articles/entities/article.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ArticleViewsService {
  constructor(
    @InjectRepository(ArticleView)
    private readonly viewRepo: Repository<ArticleView>,
    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,
  ) {}

  async addView(articleId: number, user: User): Promise<Article> {
    const article = await this.articleRepo.findOne({
      where: { id: articleId },
    });
    if (!article) throw new NotFoundException('Article not found');

    // Check if user already viewed this article
    const existing = await this.viewRepo.findOne({
      where: { article: { id: articleId }, user: { id: user.id } },
    });

    if (existing) {
      return article; // user already viewed, don’t add again
    }

    const newView = this.viewRepo.create({
      user,
      article,
    });

    article.views += 1;
    await this.viewRepo.save(newView);

    return article;
  }

  async countViews(articleId: number): Promise<number> {
    return this.viewRepo.count({
      where: { article: { id: articleId } },
    });
  }
}
