import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {path:'articles/*',
    renderMode:RenderMode.Client
  } ,
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
