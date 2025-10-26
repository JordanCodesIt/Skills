import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { gql, Apollo } from 'apollo-angular';

const CREATE_REACTION = gql`
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

const REMOVE_REACTION = gql`
  mutation RemoveArticleReaction($id: Int!) {
    removeArticleReaction(id: $id) {
      id
      type
    }
  }
`;

const GET_REACTIONS_BY_ARTICLE = gql`
  query ReactionsByArticle($articleId: Int!) {
    reactionsByArticle(articleId: $articleId) {
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

const GET_ARTICLE_COMMENTS = gql`
  query CommentsByArticle($articleId: Int!) {
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

enum ReactionType {
  LOVE = 'LOVE',
  LIKE = 'LIKE',
  FIRE = 'FIRE',
  CELEBRATE = 'CELEBRATE',
  INSIGHTFUL = 'INSIGHTFUL',
  THINKING = 'THINKING'
}

interface Reaction {
  id: string;
  emoji: string;
  name: string;
  type: ReactionType;
  count: number;
  hasReacted: boolean;
  reactionId?: number;
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
    { id: '1', emoji: '❤️', name: 'Love', type: ReactionType.LOVE, count: 0, hasReacted: false },
    { id: '2', emoji: '👍', name: 'Like', type: ReactionType.LIKE, count: 0, hasReacted: false },
    { id: '3', emoji: '🔥', name: 'Fire', type: ReactionType.FIRE, count: 0, hasReacted: false },
    { id: '4', emoji: '🎉', name: 'Celebrate', type: ReactionType.CELEBRATE, count: 0, hasReacted: false },
    { id: '5', emoji: '💡', name: 'Insightful', type: ReactionType.INSIGHTFUL, count: 0, hasReacted: false },
    { id: '6', emoji: '🤔', name: 'Thinking', type: ReactionType.THINKING, count: 0, hasReacted: false }
  ];

  comments: Comment[] = [];
  newComment: string = '';
  replyText: { [key: string]: string } = {};
  showReactionPicker: boolean = false;
  totalReactions: number = 0;
  viewsCount: number = 0;
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  currentUserId: string = '';

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.loadReactions();
    this.loadComments();
    this.loadViewsCount();
    this.recordView();
  }

  loadReactions() {
    if (!this.postId) return;

    const articleId = parseInt(this.postId);

    this.apollo.query({
      query: GET_REACTIONS_BY_ARTICLE,
      variables: { articleId },
      fetchPolicy: 'network-only'
    }).subscribe({
      next: (result: any) => {
        const backendReactions = result.data.reactionsByArticle;

        this.reactions.forEach(r => {
          r.count = 0;
          r.hasReacted = false;
          r.reactionId = undefined;
        });

        const reactionCounts: { [key: string]: number } = {};
        const userReactions: { [key: string]: number } = {};

        backendReactions.forEach((reaction: any) => {
          const type = reaction.type;
          reactionCounts[type] = (reactionCounts[type] || 0) + 1;

          if (reaction.user.id === this.currentUserId) {
            userReactions[type] = reaction.id;
          }
        });

        this.reactions.forEach(r => {
          r.count = reactionCounts[r.type] || 0;
          if (userReactions[r.type]) {
            r.hasReacted = true;
            r.reactionId = userReactions[r.type];
          }
        });

        this.calculateTotalReactions();
      },
      error: (error) => {
        console.error('Error loading reactions:', error);
      }
    });
  }

  loadComments() {
    if (!this.postId) return;

    this.isLoading = true;
    const articleId = parseInt(this.postId);

    this.apollo.query({
      query: GET_ARTICLE_COMMENTS,
      variables: { articleId },
      fetchPolicy: 'network-only'
    }).subscribe({
      next: (result: any) => {
        const commentsData = result.data.commentsByArticle;

        this.comments = commentsData.map((comment: any) => ({
          id: comment.id,
          author: {
            firstName: comment.user.firstName || 'Anonymous',
            lastName: comment.user.lastName || 'User',
            email: comment.user.email
          },
          content: comment.content,
          createdAt: new Date(comment.createdAt),
          likes: 0,
          hasLiked: false,
          replies: []
        }));

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading comments:', error);
        this.isLoading = false;
      }
    });
  }

  loadViewsCount() {
    if (!this.postId) return;

    const articleId = parseInt(this.postId);

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

  recordView() {
    if (!this.postId) return;

    const articleId = parseInt(this.postId);

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
        alert('Failed to post comment. Please try again.');
      }
    });
  }

  onReactionClick(reaction: Reaction) {
    const articleId = parseInt(this.postId);

    if (reaction.hasReacted && reaction.reactionId) {
      this.apollo.mutate({
        mutation: REMOVE_REACTION,
        variables: { id: reaction.reactionId }
      }).subscribe({
        next: () => {
          reaction.hasReacted = false;
          reaction.count--;
          reaction.reactionId = undefined;
          this.calculateTotalReactions();
          this.showReactionPicker = false;
        },
        error: (error) => {
          console.error('Error removing reaction:', error);
        }
      });
    } else {
      this.apollo.mutate({
        mutation: CREATE_REACTION,
        variables: {
          articleId: articleId,
          type: reaction.type
        }
      }).subscribe({
        next: (result: any) => {
          const newReaction = result.data.createArticleReaction;
          reaction.hasReacted = true;
          reaction.count++;
          reaction.reactionId = newReaction.id;
          this.calculateTotalReactions();
          this.showReactionPicker = false;
        },
        error: (error) => {
          console.error('Error creating reaction:', error);
        }
      });
    }
  }

  calculateTotalReactions() {
    this.totalReactions = this.reactions.reduce((sum, r) => sum + r.count, 0);
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
  }

  onDeleteComment(commentId: string) {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    this.comments = this.comments.filter(c => c.id !== commentId);
  }

  refreshComments() {
    this.loadComments();
    this.loadReactions();
    this.loadViewsCount();
  }
}
