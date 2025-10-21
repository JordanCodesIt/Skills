import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleInput } from './dto/create-article.input';
import { UpdateArticleInput } from './dto/update-article.input';
import { User } from 'src/users/entities/user.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,
    @InjectRepository(Tag) private readonly tagRepo: Repository<Tag>,
  ) {}
  async create(createArticleInput: CreateArticleInput, author: User) {
    const { title, content, coverImg, tags = [] } = createArticleInput;
    const tagEntities: Tag[] = [];
    for (const name of tags) {
      const tag = await this.tagRepo.findOne({ where: { name } });
      if (!tag) {
        throw new NotFoundException('tag not found');
      }
      tagEntities.push(tag);
    }
    const article = this.articleRepo.create({
      title,
      content,
      coverImg,
      author,
      tags: tagEntities,
    });
    return this.articleRepo.save(article);
  }

  findAll() {
    return this.articleRepo.find({
      relations: ['author', 'tags'],
      order: { createdAt: 'DESC' },
    });
  }
  async incrementViews(
    id: number,
    viewer: User | null = null,
  ): Promise<Article> {
    const article = await this.findOne(id);

    // Optional: prevent author from incrementing their own article views
    if (viewer && article.author.id === viewer.id) return article;

    article.views += 1;
    return this.articleRepo.save(article);
  }

  async findOne(id: number) {
    const article = await this.articleRepo.findOne({
      where: { id },
      relations: ['author', 'tags', 'comments', 'reactions'],
    });
    if (!article) {
      throw new NotFoundException('article not found');
    }
    return article;
  }

  async update(id: number, updateArticleInput: UpdateArticleInput) {
    const article = await this.findOne(id);
    Object.assign(article, updateArticleInput);
    return this.articleRepo.save(article);
  }

  async remove(id: number) {
    const article = await this.findOne(id);
    return this.articleRepo.remove(article);
  }
}
