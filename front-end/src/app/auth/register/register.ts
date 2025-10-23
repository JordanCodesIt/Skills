import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../auth-service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIcon,
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  constructor(readonly authService: AuthService) {}
  lastName = '';
  firstName = '';
  email = '';
  username = '';
  password = '';
  confirmPassword = '';

  register() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    const credentials = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      username: this.username,
    };

   this.authService.register(credentials).subscribe({
      next: (res) => {
        console.log(res,'res')
        localStorage.setItem('token', res.accessToken);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
