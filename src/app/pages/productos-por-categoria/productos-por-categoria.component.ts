import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../services/producto.service';
import { CategoriaService } from '../../admin/services/categoria.service';
import { ProductoDetalleDialogComponent } from '../producto-detalle/producto-detalle-dialog.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-productos-por-categoria',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    RouterModule,
    MatDialogModule,
    FooterComponent,
  ],
  templateUrl: './productos-por-categoria.component.html',
  styleUrl: './productos-por-categoria.component.css'
})
export class ProductosPorCategoriaComponent implements OnInit {
  productos: any[] = [];
  productosFiltrados: any[] = [];
  nombreCategoria = '';
  descripcionCategoria =
    'Detalla tu campaña y selecciona los materiales ideales para lograrlo.';
  imagenCategoria = '';

  filtroTexto = '';
  colorFiltro = 'todos';
  coloresDisponibles: string[] = [];

  paginaActual = 1;
  productosPorPagina = 10;

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    const idCategoria = Number(this.route.snapshot.paramMap.get('id'));
    if (idCategoria) {
      this.productoService.listarPorCategoria(idCategoria).subscribe(
        (data) => {
          this.productos = (data || []).map((p: any) => ({
            ...p,
            imagenes: Array.isArray(p?.imagenes)
              ? p.imagenes.filter(
                  (img: any, index: number, arr: any[]) =>
                    img &&
                    img.urlImagen &&
                    arr.findIndex(
                      (x: any) => x && x.urlImagen === img.urlImagen
                    ) === index
                )
              : p?.imagenes,
          }));
          if (!this.imagenCategoria && this.productos.length) {
            this.imagenCategoria = this.productos[0]?.imagenes?.[0]?.urlImagen || '';
          }
          this.actualizarColores();
          this.aplicarFiltros(false);
        },
        () => {
          this.productos = [];
          this.productosFiltrados = [];
          this.coloresDisponibles = [];
          if (!this.imagenCategoria) {
            this.imagenCategoria = '';
          }
        }
      );

      this.categoriaService.listar().subscribe({
        next: (categorias) => {
          const cat = categorias.find((c) => c.idCategoria === idCategoria);
          this.nombreCategoria = cat?.nombreCategoria || '';
          this.descripcionCategoria =
            cat?.descripcion ||
            'Detalla tu campaña y selecciona los materiales ideales para lograrlo.';
          this.imagenCategoria = cat?.imagen || this.imagenCategoria || '';
        },
        error: () => {
          this.nombreCategoria = '';
          this.descripcionCategoria =
            'Detalla tu campaña y selecciona los materiales ideales para lograrlo.';
        }
      });
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.productosFiltrados.length / this.productosPorPagina));
  }

  get productosPaginados(): any[] {
    const start = (this.paginaActual - 1) * this.productosPorPagina;
    return this.productosFiltrados.slice(start, start + this.productosPorPagina);
  }

  aplicarFiltros(resetPagina = true): void {
    const texto = this.filtroTexto.trim().toLowerCase();
    this.productosFiltrados = this.productos.filter((producto) => {
      const coincideTexto = texto
        ? (producto.nombre || '').toLowerCase().includes(texto) ||
          (producto.descripcion || '').toLowerCase().includes(texto)
        : true;

      const coincideColor =
        this.colorFiltro === 'todos'
          ? true
          : (producto.colores || []).some((color: any) => {
              const label = color?.nombreColor || color?.codigoColor;
              return label?.toLowerCase() === this.colorFiltro.toLowerCase();
            });

      return coincideTexto && coincideColor;
    });

    if (resetPagina) {
      this.paginaActual = 1;
    } else {
      this.paginaActual = Math.min(this.paginaActual, this.totalPaginas);
    }
  }

  limpiarFiltros(): void {
    this.filtroTexto = '';
    this.colorFiltro = 'todos';
    this.aplicarFiltros();
  }

  cambiarPagina(offset: number): void {
    const siguiente = this.paginaActual + offset;
    if (siguiente >= 1 && siguiente <= this.totalPaginas) {
      this.paginaActual = siguiente;
    }
  }

  abrirDetalle(producto: any): void {
    this.dialog.open(ProductoDetalleDialogComponent, {
      data: producto,
      panelClass: 'producto-detalle-dialog-panel',
      maxWidth: '95vw',
      width: '980px',
    });
  }

  private actualizarColores(): void {
    const colores = new Set<string>();
    this.productos.forEach((producto) => {
      (producto.colores || []).forEach((color: any) => {
        const label = color?.nombreColor || color?.codigoColor;
        if (label) {
          colores.add(label);
        }
      });
    });
    this.coloresDisponibles = Array.from(colores).sort((a, b) =>
      a.localeCompare(b, 'es')
    );
  }
}
