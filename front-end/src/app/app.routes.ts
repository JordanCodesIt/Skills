import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { Site } from './site/site';
import { CreatePostComponent } from './site/create-post/create-post';
export const routes: Routes = [
  { path: 'login', component: Login, pathMatch: 'full' },
  { path: 'register', component: Register, pathMatch: 'full' },
  { path: 'main', component:Site, pathMatch:'full'},
  { path:'create-post',component:CreatePostComponent,pathMatch:'full'},
];
