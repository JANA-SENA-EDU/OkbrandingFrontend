import { Routes } from '@angular/router';
import { IndexComponent } from '../pages/index/index.component';
import { HomeComponent } from '../home/pages/home/home.component';
import { LoginComponent } from '../auth/pages/login/login.component';
import { RegisterComponent } from '../auth/pages/register/register.component';
import { ClientComponent } from './client.component';
import { clientGuard } from '../auth/guards/client.guard';

export const clientRoutes: Routes = [
  {
    path: '',
    component: ClientComponent,
    children: [
      { path: '', component: IndexComponent },
      { path: 'home', component: HomeComponent },
      {
        path: 'categorias/:id/productos',
        loadComponent: () =>
          import('../pages/productos-por-categoria/productos-por-categoria.component').then(
            (m) => m.ProductosPorCategoriaComponent
          ),
      },
      {
        path: 'producto/:id',
        loadComponent: () =>
          import('../pages/producto-detalle/producto-detalle.component').then(
            (m) => m.ProductoDetalleComponent
          ),
      },
      {
        path: 'mis-cotizaciones',
        canActivate: [clientGuard],
        loadComponent: () =>
          import('./pages/mis-cotizaciones/mis-cotizaciones.component').then(
            (m) => m.MisCotizacionesComponent
          ),
      },
    ],
  },
  { path: 'login', component: LoginComponent, data: { animation: 'LoginPage' } },
  { path: 'register', component: RegisterComponent, data: { animation: 'RegisterPage' } },
  { path: '**', redirectTo: '' },
];
