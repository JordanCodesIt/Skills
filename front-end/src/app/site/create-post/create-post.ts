import { ViewChild, ElementRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { marked } from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatTabsModule } from '@angular/material/tabs';
import { gql, Apollo } from 'apollo-angular';
const CREATE_POST = gql`
  mutation CreateArticle($title: String!, $content: String!, $coverImg: String, $tags: [String!]) {
    createArticle(
      createArticleInput: { title: $title, content: $content, coverImg: $coverImg, tags: $tags }
    ) {
      id
      title
      content
      tags {
        name
      }
    }
  }
`;
@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatDialogModule,
    MatTabsModule,
  ],
  templateUrl: './create-post.html',
  styleUrl: './create-post.scss',
})
export class CreatePostComponent {
  @ViewChild('contentTextarea', { read: ElementRef }) textarea!: ElementRef<HTMLTextAreaElement>;

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer,
    private apollo: Apollo,
  ) {
    marked.setOptions({
      breaks: true,
      gfm: true,
    });
  }
  activeTab: number = 0;
  postTitle: string = '';
  postContent: string = '';
  selectedTags: string[] = [];
  customTag: string = '';
  coverImageUrl: string = '';

  availableTags: string[] = [
    'javascript',
    'typescript',
    'angular',
    'react',
    'vue',
    'nodejs',
    'python',
    'webdev',
    'tutorial',
    'opensource',
    'css',
    'html',
    'docker',
    'devops',
    'git',
    'beginners',
  ];

  goBack() {
    this.router.navigate(['/']);
  }

  getAvailableTags(): string[] {
    return this.availableTags.filter((tag) => !this.selectedTags.includes(tag));
  }

  addTag(tag: string) {
    if (!this.selectedTags.includes(tag) && this.selectedTags.length < 5) {
      this.selectedTags.push(tag);
    }
  }

  removeTag(tag: string) {
    this.selectedTags = this.selectedTags.filter((t) => t !== tag);
  }

  addCustomTag() {
    const tag = this.customTag.trim().toLowerCase().replace(/\s+/g, '-');
    if (tag && !this.selectedTags.includes(tag) && this.selectedTags.length < 5) {
      this.selectedTags.push(tag);
      this.customTag = '';
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.coverImageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeCoverImage(event: Event) {
    event.stopPropagation();
    this.coverImageUrl = '';
  }
  insertMarkdown(before: string, after: string) {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;

    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = this.postContent.substring(start, end);

    const replacement = before + (selectedText || 'text') + after;

    this.postContent =
      this.postContent.substring(0, start) + replacement + this.postContent.substring(end);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd = start + before.length + (selectedText || 'text').length;
    });
  }
  canPublish(): boolean {
    return (
      this.postTitle.trim().length > 0 &&
      this.postContent.trim().length > 0 &&
      this.selectedTags.length > 0
    );
  }

  saveDraft() {
    console.log('Saving draft...', {
      title: this.postTitle,
      content: this.postContent,
      tags: this.selectedTags,
      coverImage: this.coverImageUrl,
    });
    // this.apollo.mutate({
    //   mutation: CREATE_POST,
    //   variables: {
    //     title: this.postTitle,
    //     content: this.postContent,
    //     tags: this.selectedTags,
    //   },

    //});
    alert('Draft saved successfully!');
  }

  getMarkdownPreview(): SafeHtml {
    if (!this.postContent) {
      return (
        this.sanitizer.sanitize(1, '<p class="empty-preview">Start typing to see preview...</p>') ||
        ''
      );
    }
    const html = marked(this.postContent);
    return this.sanitizer.sanitize(1, html as string) || '';
  }
  publishPost() {
    if (this.canPublish()) {
      console.log('Publishing post...', {
        title: this.postTitle,
        content: this.postContent,
        tags: this.selectedTags,
        coverImage: this.coverImageUrl,
      });
      this.apollo.mutate({
        mutation: CREATE_POST,
        variables: {
          title: this.postTitle,
          content: this.postContent,
          tags: this.selectedTags,
          coverImg:this.coverImageUrl,
        },
      }).subscribe({
  next: (res) => console.log(' Post published:', res),
  error: (err) => console.error(' Error publishing post:', err),
});
      // this.router.navigate(['/']);
    }
  }
}
