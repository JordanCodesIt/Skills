import { Routes } from '@angular/router';
import { Site } from './site/site';
import { CreatePostComponent } from './site/create-post/create-post';
import { Register } from './auth/register/register';
import { Login } from './auth/login/login';
import { Post } from './site/articles/post/post';
export const routes: Routes = [
  { path: 'login', component: Login, pathMatch: 'full' },
  { path: 'register', component: Register, pathMatch: 'full' },
  { path: '', component:Site, pathMatch:'full'},
  { path:'create-post',component:CreatePostComponent,pathMatch:'full'},
  {path:'articles/:id',component:Post}

];
