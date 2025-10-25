import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeftSidebar } from './left-sidebar/left-sidebar';
import { Navbar } from '../shared/navbar/navbar';
import { ArticlesComponent } from './articles/articles';
import { RightSidebarComponent } from './right-sidebar/right-sidebar';
@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, LeftSidebar, ArticlesComponent,RightSidebarComponent,Navbar],
  templateUrl: './site.html',
  styleUrl: './site.scss',
})
export class Site {}
