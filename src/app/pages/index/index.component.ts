import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { CategoriaService } from '../../admin/services/categoria.service';
import { Categoria } from '../../admin/models/categoria.model';
import { AuthService } from '../../auth/services/auth.service';
import { AlertService } from '../../shared/services/alert.service';

@Component({
  selector: 'app-index',
  standalone: true,
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  imports: [CommonModule, MatButtonModule, MatCardModule, RouterModule],
})
export class IndexComponent implements OnInit {
  categorias: Categoria[] = [];

  imagenes = ['assets/img/banner1.png', 'assets/img/banner2.png', 'assets/img/banner3.png'];
  indexActual = 0;

  constructor(
    private router: Router,
    private categoriaService: CategoriaService,
    private authService: AuthService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    setInterval(() => this.siguiente(), 5000);
    this.cargarCategorias();
  }

  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  cargarCategorias(): void {
    this.categoriaService.listar().subscribe({
      next: (data) => (this.categorias = data),
      error: (err) => console.error('Error cargando categorías', err),
    });
  }

  getTransform(): string {
    return `translateX(-${this.indexActual * 100}%)`;
  }

  siguiente(): void {
    this.indexActual = (this.indexActual + 1) % this.imagenes.length;
  }

  anterior(): void {
    this.indexActual =
      (this.indexActual - 1 + this.imagenes.length) % this.imagenes.length;
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  verProductosPorCategoria(idCategoria: number): void {
    this.router.navigate(['/categorias', idCategoria, 'productos']);
  }

  goToMisCotizaciones(): void {
    this.router.navigate(['/mis-cotizaciones']);
  }

  logout(): void {
    // Cierra sesión y vuelve al inicio público
    this.authService.logout('/');
  }
}
