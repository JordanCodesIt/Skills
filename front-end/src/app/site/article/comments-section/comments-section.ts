// comments-section.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { gql, Apollo } from 'apollo-angular';
const CREATE_REACTION=gql`
mutation CreateArticleReaction($articleId: Int!, $type: ReactionType!) {
  createArticleReaction(
    createArticleReactionInput: { articleId: $articleId, type: $type }
  ) {
    id
    type
    createdAt
    user {
      id
      email
    }
  }
}

`;
const CREATE_COMMENT = gql`
  mutation CreateComment($content: String!, $articleId: Int!) {
    createComment(input: {
      content: $content
      articleId: $articleId
    }) {
      content
      user {
        id
      }
    }
  }
`;

const GET_ARTICLE_COMMENTS = gql`
  query GetCommentsByArticle($articleId: Int!) {
    commentsByArticle(articleId: $articleId) {
      id
      content
      createdAt
      user {
        id
        email
        firstName
        lastName
      }
    }
  }
`;

interface Reaction {
  id: string;
  emoji: string;
  name: string;
  count: number;
  hasReacted: boolean;
}

interface Comment {
  id: string;
  author: {
    firstName: string;
    lastName: string;
    email?: string;
    avatar?: string;
  };
  content: string;
  createdAt: Date;
  likes: number;
  hasLiked: boolean;
  replies?: Comment[];
  isReplying?: boolean;
}

@Component({
  selector: 'app-comments-section',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './comments-section.html',
  styleUrls: ['./comments-section.scss']
})
export class CommentsSection implements OnInit {
  @Input() postId: string = '';

  reactions: Reaction[] = [
    { id: '1', emoji: '❤️', name: 'Love', count: 24, hasReacted: false },
    { id: '2', emoji: '👍', name: 'Like', count: 18, hasReacted: false },
    { id: '3', emoji: '🔥', name: 'Fire', count: 12, hasReacted: false },
    { id: '4', emoji: '🎉', name: 'Celebrate', count: 8, hasReacted: false },
    { id: '5', emoji: '💡', name: 'Insightful', count: 15, hasReacted: false },
    { id: '6', emoji: '🤔', name: 'Thinking', count: 6, hasReacted: false }
  ];

  comments: Comment[] = [];
  newComment: string = '';
  replyText: { [key: string]: string } = {};
  showReactionPicker: boolean = false;
  totalReactions: number = 0;
  isLoading: boolean = false;
  isSubmitting: boolean = false;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.calculateTotalReactions();
    this.loadComments();
  }

  loadComments() {
    if (!this.postId) return;

    this.isLoading = true;
    const articleId = parseInt(this.postId);

    this.apollo.query({
      query: GET_ARTICLE_COMMENTS,
      variables: { articleId },
      fetchPolicy: 'network-only' // Always fetch fresh data
    }).subscribe({
      next: (result: any) => {
        const commentsData = result.data.commentsByArticle;

        // Transform GraphQL data to our Comment interface
        this.comments = commentsData.map((comment: any) => ({
          id: comment.id,
          author: {
            firstName: comment.user.firstName || 'Anonymous',
            lastName: comment.user.lastName || 'User',
            email: comment.user.email
          },
          content: comment.content,
          createdAt: new Date(comment.createdAt),
          likes: 0, // You can add likes to your schema later
          hasLiked: false,
          replies: [] // You can add replies to your schema later
        }));

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading comments:', error);
        this.isLoading = false;
      }
    });
  }

  // Submit new comment via GraphQL
  onSubmitComment() {
    if (!this.newComment.trim() || this.isSubmitting) return;

    const articleId = parseInt(this.postId);
    this.isSubmitting = true;
    this.apollo.mutate({
      mutation: CREATE_COMMENT,
      variables: {
        content: this.newComment.trim(),
        articleId: articleId,
      }
    }).subscribe({
      next: (result: any) => {
        const newCommentData = result.data.createComment;

        const comment: Comment = {
          id: newCommentData.id,
          author: {
            firstName: newCommentData.user.firstName || 'Current',
            lastName: newCommentData.user.lastName || 'User',
            email: newCommentData.user.email
          },
          content: newCommentData.content,
          createdAt: new Date(newCommentData.createdAt),
          likes: 0,
          hasLiked: false,
          replies: []
        };

        this.comments.unshift(comment);
        this.newComment = '';
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error creating comment:', error);
        this.isSubmitting = false;
        // You can add a toast notification here
        alert('Failed to post comment. Please try again.');
      }
    });
  }

  calculateTotalReactions() {
    this.totalReactions = this.reactions.reduce((sum, r) => sum + r.count, 0);
  }

  onReactionClick(reaction: Reaction) {
    reaction.hasReacted = !reaction.hasReacted;
    reaction.count += reaction.hasReacted ? 1 : -1;
    this.calculateTotalReactions();
    this.showReactionPicker = false;

    // TODO: Send reaction to backend
     this.apollo.mutate({
       mutation: CREATE_REACTION,
       variables: { articleId: this.postId, reactionType: reaction.id }
     }).subscribe();
  }

  getTopReactions(): Reaction[] {
    return this.reactions
      .filter(r => r.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }

  toggleReactionPicker() {
    this.showReactionPicker = !this.showReactionPicker;
  }

  getAuthorInitials(firstName: string, lastName: string): string {
    if (!firstName || !lastName) return 'U';
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }

  getAuthorFullName(author: any): string {
    return `${author.firstName} ${author.lastName}`;
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }

  onLikeComment(comment: Comment) {
    comment.hasLiked = !comment.hasLiked;
    comment.likes += comment.hasLiked ? 1 : -1;

    // TODO: Send like to backend
    // this.apollo.mutate({
    //   mutation: LIKE_COMMENT,
    //   variables: { commentId: comment.id }
    // }).subscribe();
  }

  toggleReply(comment: Comment) {
    comment.isReplying = !comment.isReplying;
    if (!comment.isReplying) {
      delete this.replyText[comment.id];
    }
  }

  onSubmitReply(parentComment: Comment) {
    const replyContent = this.replyText[parentComment.id];
    if (!replyContent || !replyContent.trim()) return;

    if (!parentComment.replies) {
      parentComment.replies = [];
    }

    // TODO: Send reply to backend
    const reply: Comment = {
      id: `${parentComment.id}-${Date.now()}`,
      author: { firstName: 'Current', lastName: 'User' },
      content: replyContent,
      createdAt: new Date(),
      likes: 0,
      hasLiked: false
    };

    parentComment.replies.push(reply);
    delete this.replyText[parentComment.id];
    parentComment.isReplying = false;

    // this.apollo.mutate({
    //   mutation: CREATE_REPLY,
    //   variables: {
    //     parentCommentId: parentComment.id,
    //     content: replyContent
    //   }
    // }).subscribe();
  }

  onDeleteComment(commentId: string) {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    this.comments = this.comments.filter(c => c.id !== commentId);

    // TODO: Send delete to backend
    // this.apollo.mutate({
    //   mutation: DELETE_COMMENT,
    //   variables: { commentId }
    // }).subscribe();
  }

  // Refresh comments (useful after actions)
  refreshComments() {
    this.loadComments();
  }
}
