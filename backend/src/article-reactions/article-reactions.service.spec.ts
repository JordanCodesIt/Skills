import { Test, TestingModule } from '@nestjs/testing';
import { ArticleReactionsService } from './article-reactions.service';

describe('ArticleReactionsService', () => {
  let service: ArticleReactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticleReactionsService],
    }).compile();

    service = module.get<ArticleReactionsService>(ArticleReactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
