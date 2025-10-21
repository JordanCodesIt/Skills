import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArticleReactionInput } from './dto/create-article-reaction.input';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/articles/entities/article.entity';
import { Repository } from 'typeorm';
import { ArticleReaction } from './entities/article-reaction.entity';

@Injectable()
export class ArticleReactionsService {
  constructor(
    @InjectRepository(ArticleReaction)
    private reactionRepo: Repository<ArticleReaction>,
    @InjectRepository(Article) private articleRepo: Repository<Article>,
  ) {}
  async create(
    createArticleReactionInput: CreateArticleReactionInput,
    user: User,
  ) {
    const article = await this.articleRepo.findOne({
      where: { id: createArticleReactionInput.articleId },
    });
    if (!article) throw new NotFoundException('Article not found');
    const existing = await this.reactionRepo.findOne({
      where: {
        user: { id: user.id },
        article: { id: createArticleReactionInput.articleId },
      },
    });
    if (existing)
      throw new ConflictException('Already reacted to this article');
    const reaction = this.reactionRepo.create({
      type: createArticleReactionInput.type,
      user,
      article,
    });
    return this.reactionRepo.save(reaction);
  }

  async remove(id: number, user: User): Promise<boolean> {
    const reaction = await this.reactionRepo.findOne({
      where: { id, user: { id: user.id } },
    });
    if (!reaction)
      throw new NotFoundException('Reaction not found or unauthorized');

    await this.reactionRepo.remove(reaction);
    return true;
  }

  async findAllByArticle(articleId: number): Promise<ArticleReaction[]> {
    return this.reactionRepo.find({
      where: { article: { id: articleId } },
      relations: ['user'],
    });
  }
}
