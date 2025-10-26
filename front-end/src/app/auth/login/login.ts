import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { UserService } from '../user-service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth-service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIcon,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  constructor(
    readonly userService: UserService,
    readonly authService : AuthService,
    readonly router : Router,
  ) {}
  email = '';
  password = '';
  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (data) => {
        console.log(data)
        this.userService.setToken(data.login);
        this.router.navigate(['/']);

      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
