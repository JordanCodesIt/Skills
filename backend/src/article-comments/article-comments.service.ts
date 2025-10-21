import { Injectable } from '@nestjs/common';
import { CreateArticleCommentInput } from './dto/create-article-comment.input';
import { UpdateArticleCommentInput } from './dto/update-article-comment.input';

@Injectable()
export class ArticleCommentsService {
  create(createArticleCommentInput: CreateArticleCommentInput) {
    return 'This action adds a new articleComment';
  }

  findAll() {
    return `This action returns all articleComments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} articleComment`;
  }

  update(id: number, updateArticleCommentInput: UpdateArticleCommentInput) {
    return `This action updates a #${id} articleComment`;
  }

  remove(id: number) {
    return `This action removes a #${id} articleComment`;
  }
}
