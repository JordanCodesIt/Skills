import { Test, TestingModule } from '@nestjs/testing';
import { ArticleViewsService } from './article-views.service';

describe('ArticleViewsService', () => {
  let service: ArticleViewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticleViewsService],
    }).compile();

    service = module.get<ArticleViewsService>(ArticleViewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
