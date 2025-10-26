import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { gql, Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { CommentsSection } from '../../article/comments-section/comments-section';

export const GET_ARTICLE_BY_ID = gql`
  query GetArticle($id: Int!) {
    article(id: $id) {
      id
      title
      content
      coverImg
      createdAt
      views
      author {
        firstName
        lastName
        email
      }
      tags {
        name
      }
    }
  }
`;

const VIEW_ARTICLE = gql`
  mutation ViewArticle($articleId: Int!) {
    viewArticle(articleId: $articleId) {
      id
      views
    }
  }
`;

const GET_ARTICLE_VIEWS_COUNT = gql`
  query ArticleViewsCount($articleId: Int!) {
    articleViewsCount(articleId: $articleId)
  }
`;

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [CommonModule, CommentsSection],
  templateUrl: './post.html',
  styleUrls: ['./post.scss']
})
export class Post implements OnInit, OnDestroy {
  private location = inject(Location);
  private router = inject(Router);

  article: any = null;
  isLoading = true;
  viewsCount: number = 0;
  private querySubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private apollo: Apollo,
  ) {}

  ngOnInit() {
    this.isLoading = true;
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.querySubscription = this.apollo
        .watchQuery({
          query: GET_ARTICLE_BY_ID,
          variables: { id: Number(id) },
          fetchPolicy: 'network-only'
        })
        .valueChanges.subscribe({
          next: ({ data }: any) => {
            this.article = data.article;
            console.log('article', this.article);
            this.isLoading = false;
            this.recordView(Number(id));
            this.loadViewsCount(Number(id));
          },
          error: (error) => {
            console.error('Error loading article:', error);
            this.isLoading = false;
          }
        });
    }
  }

  recordView(articleId: number) {
    this.apollo.mutate({
      mutation: VIEW_ARTICLE,
      variables: { articleId }
    }).subscribe({
      next: (result: any) => {
        this.viewsCount = result.data.viewArticle.views;
      },
      error: (error) => {
        console.error('Error recording view:', error);
      }
    });
  }

  loadViewsCount(articleId: number) {
    this.apollo.query({
      query: GET_ARTICLE_VIEWS_COUNT,
      variables: { articleId },
      fetchPolicy: 'network-only'
    }).subscribe({
      next: (result: any) => {
        this.viewsCount = result.data.articleViewsCount;
      },
      error: (error) => {
        console.error('Error loading views count:', error);
      }
    });
  }

  goBack() {
    this.location.back();
  }

  getAuthorInitials(): string {
    if (!this.article?.author) return 'U';
    const first = this.article.author.firstName?.[0] || '';
    const last = this.article.author.lastName?.[0] || '';
    return (first + last).toUpperCase();
  }

  getAuthorFullName(): string {
    if (!this.article?.author) return 'Unknown Author';
    return `${this.article.author.firstName} ${this.article.author.lastName}`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getReadingTime(): number {
    if (!this.article?.content) return 0;
    const wordsPerMinute = 200;
    const wordCount = this.article.content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  renderMarkdown(content: string): string {
    return content
      .replace(/\n\n/g, '</p><p>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
      .replace(/^- (.*$)/gim, '<li>$1</li>');
  }

  onShare() {
    if (navigator.share) {
      navigator.share({
        title: this.article.title,
        url: window.location.href
      });
    }
  }

  onBookmark() {
    console.log('Bookmark article:', this.article.id);
  }

  ngOnDestroy() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }
}
