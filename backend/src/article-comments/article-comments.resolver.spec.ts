import { Test, TestingModule } from '@nestjs/testing';
import { ArticleCommentsResolver } from './article-comments.resolver';
import { ArticleCommentsService } from './article-comments.service';

describe('ArticleCommentsResolver', () => {
  let resolver: ArticleCommentsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticleCommentsResolver, ArticleCommentsService],
    }).compile();

    resolver = module.get<ArticleCommentsResolver>(ArticleCommentsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
