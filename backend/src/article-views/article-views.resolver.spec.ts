import { Test, TestingModule } from '@nestjs/testing';
import { ArticleViewsResolver } from './article-views.resolver';
import { ArticleViewsService } from './article-views.service';

describe('ArticleViewsResolver', () => {
  let resolver: ArticleViewsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticleViewsResolver, ArticleViewsService],
    }).compile();

    resolver = module.get<ArticleViewsResolver>(ArticleViewsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
