import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-post-card',
  imports: [CommonModule, MatIconModule],
  templateUrl: './article.html',
  styleUrls: ['./article.scss']
})
export class PostCardComponent {
  @Input() category: string = 'Hacktoberfest: Contribution Chronicles';
  @Input() authorName: string = 'Sudharsan Saravanan';
  @Input() postDate: string = 'Oct 21';
  @Input() title: string = 'My Hacktoberfest 2025 Journey: Lessons from 14 Accepted PRs';
  @Input() tags: string[] = ['hacktoberfest', 'opensource', 'devchallenge', 'webdev'];
  @Input() readTime: number = 2;
  @Input() isBookmarked: boolean = false;

  @Output() commentClick = new EventEmitter<void>();
  @Output() bookmarkClick = new EventEmitter<boolean>();

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  onAddComment() {
    this.commentClick.emit();
  }

  onBookmark() {
    this.isBookmarked = !this.isBookmarked;
    this.bookmarkClick.emit(this.isBookmarked);
  }
}
