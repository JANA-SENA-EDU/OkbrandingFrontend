import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../../services/producto.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../../../admin/services/categoria.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    CommonModule,
    RouterModule,
    FormsModule,
    MatIconModule,
  ],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css',
})
export class ProductosComponent implements OnInit {
  productos: any[] = [];
  categorias: any[] = [];
  categoriaSeleccionada: number | null = null;
  estadoFiltro: 'todos' | 'activos' | 'inactivos' = 'todos';
  terminoBusqueda = '';

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    this.obtenerCategorias();
    this.obtenerProductos();
  }

  obtenerCategorias(): void {
    this.categoriaService.listar().subscribe({
      next: (data) => {
        this.categorias = data;
        this.asignarCategoriasAProductos();
      },
      error: () => (this.categorias = []),
    });
  }

  obtenerProductos(categoriaId?: number | null): void {
    if (categoriaId) {
      this.productoService.listarPorCategoria(categoriaId).subscribe({
        next: (data) => {
          this.productos = data;
          this.asignarCategoriasAProductos();
        },
        error: () => (this.productos = []),
      });
    } else {
      this.productoService.listarProductos().subscribe({
        next: (data) => {
          this.productos = data;
          this.asignarCategoriasAProductos();
        },
        error: () => (this.productos = []),
      });
    }
  }

  onCategoriaChange(value: number | null): void {
    this.categoriaSeleccionada = value ?? null;
    this.obtenerProductos(this.categoriaSeleccionada);
  }

  get productosFiltrados(): any[] {
    return this.productos
      .filter((producto) => {
        if (this.estadoFiltro === 'activos') {
          return producto.idEstadoProducto !== 2;
        }
        if (this.estadoFiltro === 'inactivos') {
          return producto.idEstadoProducto === 2;
        }
        return true;
      })
      .filter((producto) => {
        if (!this.terminoBusqueda.trim()) {
          return true;
        }
        const termino = this.terminoBusqueda.toLowerCase();
        return (
          producto.nombre?.toLowerCase().includes(termino) ||
          producto.descripcion?.toLowerCase().includes(termino)
        );
      });
  }

  limpiarFiltros(): void {
    this.terminoBusqueda = '';
    this.estadoFiltro = 'todos';
    this.categoriaSeleccionada = null;
    this.obtenerProductos();
  }

  eliminarProducto(idProducto: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productoService.eliminarProducto(idProducto).subscribe({
        next: () => {
          this.obtenerProductos(this.categoriaSeleccionada);
        },
        error: () => {
          // las alertas ya se notifican en el servicio
        },
      });
    }
  }

  private asignarCategoriasAProductos(): void {
    if (!this.productos?.length || !this.categorias?.length) {
      return;
    }

    this.productos = this.productos.map((producto) => ({
      ...producto,
      categoria:
        this.categorias.find(
          (cat) => cat.idCategoria === producto.idCategoria
        ) || producto.categoria,
    }));
  }
}
