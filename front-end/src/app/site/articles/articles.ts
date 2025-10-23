// articles.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostCardComponent } from '../article/article';
interface Post {
  id: number;
  category: string;
  authorName: string;
  postDate: string;
  title: string;
  tags: string[];
  readTime: number;
  isBookmarked: boolean;
}

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [CommonModule, PostCardComponent],
  templateUrl:'./articles.html',
  styleUrl:'./articles.scss',
})
export class ArticlesComponent implements OnInit {
  selectedFilter: string = 'all';
  posts: Post[] = [];
  filteredPosts: Post[] = [];

  ngOnInit() {
    this.loadPosts();
    this.filteredPosts = this.posts;
  }

  loadPosts() {
    this.posts = [
      {
        id: 1,
        category: 'Hacktoberfest: Contribution Chronicles',
        authorName: 'Sudharsan Saravanan',
        postDate: 'Oct 21',
        title: 'My Hacktoberfest 2025 Journey: Lessons from 14 Accepted PRs',
        tags: ['hacktoberfest', 'opensource', 'devchallenge', 'webdev'],
        readTime: 2,
        isBookmarked: false
      },
      {
        id: 2,
        category: 'Web Development',
        authorName: 'Jane Smith',
        postDate: 'Oct 20',
        title: 'Building Modern Angular Applications with Standalone Components',
        tags: ['angular', 'typescript', 'webdev', 'tutorial'],
        readTime: 5,
        isBookmarked: false
      },
      {
        id: 3,
        category: 'Open Source',
        authorName: 'John Doe',
        postDate: 'Oct 19',
        title: 'Contributing to Open Source: A Beginner\'s Guide',
        tags: ['opensource', 'git', 'github', 'beginners'],
        readTime: 4,
        isBookmarked: true
      },
      {
        id: 4,
        category: 'DevOps',
        authorName: 'Alice Johnson',
        postDate: 'Oct 18',
        title: 'Mastering Docker for Modern Web Development',
        tags: ['docker', 'devops', 'containers', 'webdev'],
        readTime: 6,
        isBookmarked: false
      },
      {
        id: 5,
        category: 'Hacktoberfest',
        authorName: 'Bob Wilson',
        postDate: 'Oct 17',
        title: 'Top 10 Hacktoberfest Projects to Contribute To',
        tags: ['hacktoberfest', 'opensource', 'community'],
        readTime: 3,
        isBookmarked: false
      },
      {
        id: 6,
        category: 'JavaScript',
        authorName: 'Emma Davis',
        postDate: 'Oct 16',
        title: 'ES2024 Features Every Developer Should Know',
        tags: ['javascript', 'es2024', 'webdev', 'tutorial'],
        readTime: 7,
        isBookmarked: true
      }
    ];
  }

  filterPosts(filter: string) {
    this.selectedFilter = filter;

    if (filter === 'all') {
      this.filteredPosts = this.posts;
    } else {
      this.filteredPosts = this.posts.filter(post =>
        post.tags.includes(filter) || post.category.toLowerCase().includes(filter)
      );
    }
  }

  handleComment(post: Post) {
    console.log('Comment clicked for post:', post.title);
    alert(`Opening comments for: ${post.title}`);
  }

  handleBookmark(post: Post, isBookmarked: boolean) {
    console.log(`Post ${post.id} bookmark status:`, isBookmarked);
    const postIndex = this.posts.findIndex(p => p.id === post.id);
    if (postIndex !== -1) {
      this.posts[postIndex].isBookmarked = isBookmarked;
    }
  }
}
