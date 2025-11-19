import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { CategoriaService } from '../../admin/services/categoria.service';

@Component({
  selector: 'app-productos-por-categoria',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule], // <-- agrega RouterModule aquí
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
    private router: Router
  ) {}

  ngOnInit() {
    const idCategoria = Number(this.route.snapshot.paramMap.get('id'));
    if (idCategoria) {
      this.productoService.listarPorCategoria(idCategoria).subscribe(
        data => this.productos = data,
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
}
