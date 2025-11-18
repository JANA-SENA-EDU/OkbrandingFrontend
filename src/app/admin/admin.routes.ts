import { Routes } from '@angular/router';
import { AdminComponent } from '../admin/admin.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'usuarios', pathMatch: 'full' },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./pages/usuarios/usuarios.component').then(
            (m) => m.UsuariosComponent
          ),
      },
      {
        path: 'productos',
        loadComponent: () =>
          import('./pages/productos/productos.component').then(
            (m) => m.ProductosComponent
          ),
      },
      {
        path: 'productos/crear',
        loadComponent: () =>
          import('./pages/productos/crear-producto/crear-producto.component').then(
            (m) => m.CrearProductoComponent
          ),
      },
      {
        path: 'productos/editar/:id',
        loadComponent: () =>
          import('./pages/productos/crear-producto/crear-producto.component').then(
            (m) => m.CrearProductoComponent
          ),
      },
      {
        path: 'categorias',
        loadComponent: () =>
          import('./pages/categorias/categoria.component').then(
            (m) => m.CategoriaComponent
          ),
      },
      {
        path: 'pedidos',
        loadComponent: () =>
          import('./pages/pedidos/pedidos.component').then(
            (m) => m.PedidosComponent
          ),
      },
      {
        path: 'estadoProductos',
        loadComponent: () =>
          import('./pages/estado-producto/estado-producto.component').then(
            (m) => m.EstadoProductoComponent
          ),
      },
      {
        path: 'colores',
        loadComponent: () =>
          import('./pages/colores/colores.component').then(
            (m) => m.ColorComponent
          ),
      },
    ],
  },
];

