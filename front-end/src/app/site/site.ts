import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar';
import { ArticlesComponent } from './articles/articles';
@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, SidebarComponent, ArticlesComponent],
  templateUrl: './site.html',
  styleUrl: './site.scss',
})
export class Site {}
