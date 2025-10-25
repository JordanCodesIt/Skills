import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { gql,Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
export const GET_ARTICLE_BY_ID = gql`
  query GetArticle($id: Int!) {
    article(id: $id) {
      id
      title
      content
      coverImg
      createdAt
      author {
        firstName
        lastName
        email }
      tags {
        name
      }
    }
  }
`;


@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post.html',
  styleUrls: ['./post.scss']
})
export class Post implements OnInit,OnDestroy {
  article: any = null;
  isLoading = true;
  private querySubscription!: Subscription;
  constructor(
    private route: ActivatedRoute,
    private apollo:Apollo,
  ) {}
ngOnInit() {
  this.isLoading = true;  // ← Start loading

  const id = this.route.snapshot.paramMap.get('id');

  if (id) {
    this.querySubscription = this.apollo
      .watchQuery({
        query: GET_ARTICLE_BY_ID,
        variables: { id: Number(id) }
      })
      .valueChanges.subscribe({
        next: ({ data }: any) => {
          this.article = data.article;
          console.log('article', this.article);
          this.isLoading = false;  // ← Stop loading on success
        },
        error: (error) => {
          console.error('Error loading article:', error);
          this.isLoading = false;  // ← Stop loading on error
        }
      });
  }
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
  this.querySubscription.unsubscribe();
}


}
