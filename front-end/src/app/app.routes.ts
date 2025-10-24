import { Routes } from '@angular/router';
import { Site } from './site/site';
import { CreatePostComponent } from './site/create-post/create-post';
import { Register } from './auth/register/register';
import { Login } from './auth/login/login';
export const routes: Routes = [
  { path: 'login', component: Login, pathMatch: 'full' },
  { path: 'register', component: Register, pathMatch: 'full' },
  { path: '', component:Site, pathMatch:'full'},
  { path:'create-post',component:CreatePostComponent,pathMatch:'full'},
];
