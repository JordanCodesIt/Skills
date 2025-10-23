import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar';
import { RightSidebarComponent } from './right-sidebar/right-sidebar';
import { ArticlesComponent } from './articles/articles';
import { Navbar } from '../shared/navbar/navbar';
@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, SidebarComponent, ArticlesComponent,RightSidebarComponent,Navbar],
  templateUrl: './site.html',
  styleUrl: './site.scss',
})
export class Site {}
