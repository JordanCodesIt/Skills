import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
interface Tag {
  name: string;
}
@Component({
  selector: 'app-post-card',
  imports: [CommonModule, MatIconModule],
  templateUrl: './article.html',
  styleUrls: ['./article.scss'],
})
export class PostCardComponent {
  // @Input() category!: Tag ;
  constructor(private router: Router) {}
  @Input() authorName: string = 'Sudharsan Saravanan';
  @Input() postDate: string = 'Oct 21';
  @Input() title: string = 'My Hacktoberfest 2025 Journey: Lessons from 14 Accepted PRs';
  @Input() tags!: Tag[];
  @Input() readTime: number = 2;
  @Input() isBookmarked: boolean = false;
  @Input() commentsCount!: number;
  @Input() viewsCount!: number;
  @Input() reactionsCount!: number;
  @Output() commentClick = new EventEmitter<void>();
  @Output() bookmarkClick = new EventEmitter<boolean>();
  @Output() cardClick = new EventEmitter<void>();
  getInitials(name: string): string {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
  onAddComment(event: Event) {
    event.stopPropagation();
    this.commentClick.emit();
  }
  onCardClick() {
    this.cardClick.emit();
  }

  onBookmark(event:Event) {
    event.stopPropagation()
    this.isBookmarked = !this.isBookmarked;
    this.bookmarkClick.emit(this.isBookmarked);
  }
}
