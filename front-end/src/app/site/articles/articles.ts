import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostCardComponent } from '../article/article';
import { gql, Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
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

const GET_ARTICLES = gql`
  query {
    articles {
      id
      title
      content
      coverImg
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
  posts: Post[]=[];
  loading! : boolean ;
  filteredPosts: Post[] = [];
  constructor(readonly apollo: Apollo) {}

  ngOnInit() {
    this.querySubscription = this.apollo
      .watchQuery<any>({
        query: GET_ARTICLES,
      })
      .valueChanges.subscribe(({ data, loading }) => {
        this.loading = loading;
        if (!loading){

        this.posts = data.articles;
        }

      });
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }
  filterPosts(filter: string) {
    this.selectedFilter = filter;

    if (filter === 'all') {
      this.filteredPosts = this.posts;
    } else {
      this.filteredPosts = this.posts.filter(
        (post) => post.tags.includes(filter) || post.category.toLowerCase().includes(filter),
      );
    }
  }

  handleComment(post: Post) {
    console.log('Comment clicked for post:', post.title);
    alert(`Opening comments for: ${post.title}`);
  }

  handleBookmark(post: Post, isBookmarked: boolean) {
    console.log(`Post ${post.id} bookmark status:`, isBookmarked);
    const postIndex = this.posts.findIndex((p) => p.id === post.id);
    if (postIndex !== -1) {
      this.posts[postIndex].isBookmarked = isBookmarked;
    }
  }
}
