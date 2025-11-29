import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { Categoria } from '../../admin/models/categoria.model';
import { CategoriaService } from '../../admin/services/categoria.service';
import { ClientNavbarComponent } from '../../client/components/client-navbar/client-navbar.component';
import { AboutUsComponent } from '../../shared/components/about-us/about-us.component';
import { CategoriesGridComponent } from '../../shared/components/categories-grid/categories-grid.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { HeroCarouselComponent } from '../../shared/components/hero-carousel/hero-carousel.component';

@Component({
  selector: 'app-index',
  standalone: true,
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    ClientNavbarComponent,
    FooterComponent,
    AboutUsComponent,
    HeroCarouselComponent,
    CategoriesGridComponent,
  ],
})
export class IndexComponent implements OnInit {
  categorias: Categoria[] = [];

  constructor(
    private router: Router,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.categoriaService.listar().subscribe({
      next: (data) => (this.categorias = data),
      error: (err) => console.error('Error cargando categorias', err),
    });
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

  scrollTo(sectionId: string): void {
    if (typeof document === 'undefined') {
      return;
    }

    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
