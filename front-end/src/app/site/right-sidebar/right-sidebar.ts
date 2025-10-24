// right-sidebar.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface PopularThread {
  id: number;
  title: string;
  author: string;
  replies: number;
  views: number;
}

@Component({
  selector: 'app-right-sidebar',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl:'./right-sidebar.html',
  styleUrl:'./right-sidebar.scss',
})
export class RightSidebarComponent {
  popularThreads: PopularThread[] = [
    {
      id: 1,
      title: 'Best practices for Angular state management in 2025',
      author: 'Sarah Chen',
      replies: 47,
      views: 3200
    },
    {
      id: 2,
      title: 'How to optimize React performance for large applications',
      author: 'Mike Johnson',
      replies: 32,
      views: 2800
    },
    {
      id: 3,
      title: 'TypeScript 5.0 new features you should know',
      author: 'Emma Davis',
      replies: 28,
      views: 2100
    },
    {
      id: 4,
      title: 'Building scalable microservices with Node.js',
      author: 'David Wilson',
      replies: 25,
      views: 1900
    },
    {
      id: 5,
      title: 'CSS Grid vs Flexbox: When to use which?',
      author: 'Lisa Anderson',
      replies: 19,
      views: 1500
    }
  ];

  constructor(private router: Router) {}

  navigateToCreatePost() {
    console.log('clicked');
    this.router.navigate(['/create-post']);
  }

  navigateToThread(thread: PopularThread) {
    console.log('Navigate to thread:', thread.id);
    this.router.navigate(['/thread', thread.id]);
  }

  viewAllThreads() {
    this.router.navigate(['/discussions']);
  }

  formatViews(views: number): string {
    if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'k';
    }
    return views.toString();
  }
}
