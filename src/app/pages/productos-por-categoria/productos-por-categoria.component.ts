import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductoService } from '../../services/producto.service';
import { CategoriaService } from '../../admin/services/categoria.service';
import { ProductoDetalleDialogComponent } from '../producto-detalle/producto-detalle-dialog.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-productos-por-categoria',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule, MatDialogModule, FooterComponent],
  templateUrl: './productos-por-categoria.component.html',
  styleUrl: './productos-por-categoria.component.css'
})
export class ProductosPorCategoriaComponent implements OnInit {
  productos: any[] = [];
  nombreCategoria = '';

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
        data => {
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
        },
        err => this.productos = []
      );

      this.categoriaService.listar().subscribe({
        next: (categorias) => {
          const cat = categorias.find(c => c.idCategoria === idCategoria);
          this.nombreCategoria = cat?.nombreCategoria || '';
        },
        error: () => {
          this.nombreCategoria = '';
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

  abrirDetalle(producto: any): void {
    this.dialog.open(ProductoDetalleDialogComponent, {
      data: producto,
      panelClass: 'producto-detalle-dialog-panel',
      maxWidth: '95vw',
      width: '980px',
    });
  }
}
