import { Test, TestingModule } from '@nestjs/testing';
import { ArticleReactionsResolver } from './article-reactions.resolver';
import { ArticleReactionsService } from './article-reactions.service';

describe('ArticleReactionsResolver', () => {
  let resolver: ArticleReactionsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticleReactionsResolver, ArticleReactionsService],
    }).compile();

    resolver = module.get<ArticleReactionsResolver>(ArticleReactionsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
