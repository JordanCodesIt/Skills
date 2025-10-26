import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostCardComponent } from '../article/article';
import { gql, Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
interface Tag {
  name: string;
}
interface Post {
  id: number;
  author: { firstName: string; lastName: string };
  createdAt: string;
  title: string;
  tags: Tag[];
  commentsCount: number;
  viewsCount: number;
  reactionsCount: number;
  // readTime: number;
  // isBookmarked: boolean;
}

const GET_TAGS = gql`
  query {
    tags {
      id
      name
    }
  }
`;

const GET_ARTICLES = gql`
  query {
    articles {
      id
      title
      coverImg
      createdAt
      commentsCount
      reactionsCount
      viewsCount
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

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [CommonModule, PostCardComponent],
  templateUrl: './articles.html',
  styleUrl: './articles.scss',
})
export class ArticlesComponent implements OnInit, OnDestroy {
  selectedFilter: string = 'all';
  private querySubscription!: Subscription;
  posts!: Post[];
  tags: Tag[] = [{ name: 'All' }];
  loading!: boolean;
  filteredPosts: Post[] = [];
  private router = inject(Router);

  constructor(
    readonly apollo: Apollo,
    private snackBar: MatSnackBar,
  ) {}
  ngOnInit() {
    this.querySubscription = this.apollo
      .watchQuery<any>({
        query: GET_ARTICLES,
      })
      .valueChanges.subscribe(({ data, loading }) => {
        this.loading = loading;

        if (!loading && data && data.articles) {
          this.posts = data.articles;
          this.filteredPosts = this.posts;
        }
      });
    this.apollo
      .watchQuery<any>({
        query: GET_TAGS,
      })
      .valueChanges.subscribe(({ data, loading }) => {
        this.loading = loading;

        if (!loading && data && data.tags) {
          this.tags = data.tags;
        }
      });
  }
  filterPosts(filter: string) {
    this.selectedFilter = filter;

    if (filter === 'all') {
      this.filteredPosts = this.posts;
      console.log(this.filteredPosts, 'filtred posts');
    } else {
      this.filteredPosts = this.posts.filter((post) =>
        post.tags.some((tag) => tag.name.toLowerCase().includes(filter.toLowerCase())),
      );
    }
  }

  handleComment(post: Post) {
    console.log('Comment clicked for post:', post.title);

    alert(`Opening comments for: ${post.title}`);
  }
  handleClick(post: Post) {
    this.router.navigate(['/articles', post.id]);
  }
  handleBookmark(post: Post, isBookmarked: boolean) {
    console.log(`Post ${post.id} bookmark status:`, isBookmarked);
    const postIndex = this.posts.findIndex((p) => p.id === post.id);
    if (postIndex !== -1) {
      //this.posts[postIndex].isBookmarked = isBookmarked;
    }
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }
}
