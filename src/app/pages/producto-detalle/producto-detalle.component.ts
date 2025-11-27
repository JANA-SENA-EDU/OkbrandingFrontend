import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../auth/services/auth.service';
import { CotizacionService } from '../../services/cotizacion.service';

@Component({                                                                                                             
    selector: 'app-producto-detalle',                                                                                      
    standalone: true,                                                                                                      
    imports: [CommonModule, MatCardModule, RouterModule, MatButtonModule],                                                 
    templateUrl: './producto-detalle.component.html',                                                                      
    styleUrls: ['./producto-detalle.component.css']                                                                        
  })  
export class ProductoDetalleComponent implements OnInit, OnDestroy {
  producto: any;
  selectedImagenIndex = 0;
  private autoSlideIntervalId: any;

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private router: Router,
    private authService: AuthService,
    private cotizacionService: CotizacionService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.productoService.obtenerPorId(id).subscribe(
        data => {
          this.producto = {
            ...data,
            imagenes: Array.isArray(data?.imagenes)
              ? data.imagenes.filter(
                  (img: any, index: number, arr: any[]) =>
                    img &&
                    img.urlImagen &&
                    arr.findIndex(x => x && x.urlImagen === img.urlImagen) === index
                )
              : data?.imagenes,
          };
          this.selectedImagenIndex = 0;
          this.startAutoSlide();
        },
        err => this.router.navigate(['/']) // Redirige si no existe
      );
    }
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  ngOnDestroy(): void {
    this.clearAutoSlide();
  }

  get imagenSeleccionada(): string | null {
    if (this.producto?.imagenes?.length) {
      const img = this.producto.imagenes[this.selectedImagenIndex] || this.producto.imagenes[0];
      return img?.urlImagen || null;
    }
    return null;
  }

  selectImagen(index: number): void {
    if (!this.producto?.imagenes?.length) {
      return;
    }
    if (index >= 0 && index < this.producto.imagenes.length) {
      this.selectedImagenIndex = index;
      this.restartAutoSlide();
    }
  }

  nextImagen(): void {
    if (!this.producto?.imagenes?.length) {
      return;
    }
    const total = this.producto.imagenes.length;
    this.selectedImagenIndex = (this.selectedImagenIndex + 1) % total;
  }

  prevImagen(): void {
    if (!this.producto?.imagenes?.length) {
      return;
    }
    const total = this.producto.imagenes.length;
    this.selectedImagenIndex =
      (this.selectedImagenIndex - 1 + total) % total;
  }

  private startAutoSlide(): void {
    this.clearAutoSlide();
    if (!this.producto?.imagenes?.length || this.producto.imagenes.length <= 1) {
      return;
    }
    this.autoSlideIntervalId = setInterval(() => {
      this.nextImagen();
    }, 5000);
  }

  private clearAutoSlide(): void {
    if (this.autoSlideIntervalId) {
      clearInterval(this.autoSlideIntervalId);
      this.autoSlideIntervalId = null;
    }
  }

  private restartAutoSlide(): void {
    this.startAutoSlide();
  }

  cotizar(): void {                                                                                                        
    if (!this.authService.isAuthenticated()) {                                                                             
      this.router.navigate(['/login']);                                                                                    
      return;                                                                                                              
    }                                                                                                                      
                                                                                                                           
    if (this.producto) {                                                                                                   
      this.cotizacionService.agregarProducto(this.producto);                                                               
    }                                                                                                                      
                                                                                                                           
    this.router.navigate(['/mis-cotizaciones']);                                                                           
  }
}
