// sidebar.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

interface SocialLink {
  name: string;
  icon: string;
  url: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl:'./left-sidebar.html',
  styleUrl:'./left-sidebar.scss'
})
export class LeftSidebar {
  categories: string[] = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'DevOps',
    'Cybersecurity',
    'UI/UX Design',
    'Cloud Computing',
    'Blockchain'
  ];

  socialLinks: SocialLink[] = [
    { name: 'LinkedIn', icon: 'linkedin', url: 'https://linkedin.com' },
    { name: 'GitHub', icon: 'code', url: 'https://github.com' },
    { name: 'Twitter', icon: 'tag', url: 'https://twitter.com' },
    { name: 'YouTube', icon: 'play_circle', url: 'https://youtube.com' },
    { name: 'Discord', icon: 'forum', url: 'https://discord.com' },
    { name: 'Email', icon: 'email', url: 'mailto:contact@example.com' }
  ];

  popularTags: string[] = [
    'javascript',
    'typescript',
    'angular',
    'react',
    'nodejs',
    'python',
    'webdev',
    'tutorial',
    'opensource',
    'beginners',
    'css',
    'html'
  ];

  onCategoryClick(category: string) {
    console.log('Category clicked:', category);
    // Add your navigation logic here
  }

  onTagClick(tag: string) {
    console.log('Tag clicked:', tag);
    // Add your filter/navigation logic here
  }
}
