import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleComment } from './entities/article-comment.entity';
import { CreateArticleCommentInput } from './dto/create-article-comment.input';
import { User } from 'src/users/entities/user.entity';
import { Article } from 'src/articles/entities/article.entity';

@Injectable()
export class ArticleCommentsService {
  constructor(
    @InjectRepository(ArticleComment)
    private readonly commentRepo: Repository<ArticleComment>,
    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,
  ) {}

  async create(input: CreateArticleCommentInput, user: User) {
    const article = await this.articleRepo.findOne({
      where: { id: input.articleId },
    });
    if (!article) throw new NotFoundException('Article not found');

    let parentComment: ArticleComment | undefined = undefined;
    if (input.parentCommentId) {
      const found = await this.commentRepo.findOne({
        where: { id: input.parentCommentId },
      });
      if (!found) throw new NotFoundException('Parent comment not found');
      parentComment = found;
    }

    const comment = this.commentRepo.create({
      content: input.content,
      article,
      user,
      parentComment,
    });

    return this.commentRepo.save(comment);
  }

  async findByArticle(articleId: number) {
    return this.commentRepo.find({
      where: { article: { id: articleId } },
      relations: ['user', 'replies', 'replies.user'],
      order: { createdAt: 'ASC' },
    });
  }
}
