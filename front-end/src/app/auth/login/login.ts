import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../auth-service';
import { ToastrService } from 'ngx-toastr';
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
    readonly authService: AuthService,
    private toastr: ToastrService,
  ) {}
  email = '';
  password = '';
  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.accessToken);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
