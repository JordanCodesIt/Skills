import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import {Router} from "@angular/router"
@Component({
  selector: 'app-navbar',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatIconModule,
    MatDividerModule,
    MatMenuModule,
    MatInputModule,
    MatFormFieldModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  searchQuery: string = '';
  isAuthenticated: boolean = false;
  constructor(private router: Router) {}
  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToSignup() {
    this.router.navigate(['/register']);
  }

  logout() {
    this.isAuthenticated = false;
    this.router.navigate(['/login']);
  }
}
