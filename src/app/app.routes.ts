import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.routes').then((m) => m.adminRoutes),
  },
  {
    path: '',
    loadChildren: () =>
      import('./client/client.routes').then((m) => m.clientRoutes),
  },
  { path: '**', redirectTo: '' },
];
