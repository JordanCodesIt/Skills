import { Routes } from '@angular/router';
import { Site } from './site/site';
import { CreatePostComponent } from './site/create-post/create-post';
import { Register } from './auth/register/register';
import { Login } from './auth/login/login';
import { Post } from './site/articles/post/post';
import { AuthGuard } from './auth/auth-guard';

export const routes: Routes = [
  { path: 'login', component: Login, pathMatch: 'full' },
  { path: 'register', component: Register, pathMatch: 'full' },
  { path: '', component:Site, pathMatch:'full'},
  { path:'create-post',component:CreatePostComponent,pathMatch:'full',canActivate:[AuthGuard]},
  {path:'articles/:id',component:Post,  data: { prerender: false }},

];
