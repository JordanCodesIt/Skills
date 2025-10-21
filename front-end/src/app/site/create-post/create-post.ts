import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

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
  ],
  templateUrl:'./create-post.html',
  styleUrl:'./create-post.scss'
})
export class CreatePostComponent {
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
    'beginners'
  ];

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/']);
  }

  getAvailableTags(): string[] {
    return this.availableTags.filter(tag => !this.selectedTags.includes(tag));
  }

  addTag(tag: string) {
    if (!this.selectedTags.includes(tag) && this.selectedTags.length < 5) {
      this.selectedTags.push(tag);
    }
  }

  removeTag(tag: string) {
    this.selectedTags = this.selectedTags.filter(t => t !== tag);
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
    this.postContent += before + after;
  }

  canPublish(): boolean {
    return this.postTitle.trim().length > 0 &&
           this.postContent.trim().length > 0 &&
           this.selectedTags.length > 0;
  }

  saveDraft() {
    console.log('Saving draft...', {
      title: this.postTitle,
      content: this.postContent,
      tags: this.selectedTags,
      coverImage: this.coverImageUrl
    });
    alert('Draft saved successfully!');
  }

  publishPost() {
    if (this.canPublish()) {
      console.log('Publishing post...', {
        title: this.postTitle,
        content: this.postContent,
        tags: this.selectedTags,
        coverImage: this.coverImageUrl
      });
      alert('Post published successfully!');
      this.router.navigate(['/']);
    }
  }
}
