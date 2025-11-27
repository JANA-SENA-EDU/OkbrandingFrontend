import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { CotizacionService } from '../../services/cotizacion.service';

@Component({
  selector: 'app-producto-detalle-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './producto-detalle-dialog.component.html',
  styleUrl: './producto-detalle-dialog.component.css',
})
export class ProductoDetalleDialogComponent implements OnInit, OnDestroy {
  producto: any;
  selectedImagenIndex = 0;
  private autoSlideIntervalId: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ProductoDetalleDialogComponent>,
    private router: Router,
    private authService: AuthService,
    private cotizacionService: CotizacionService
  ) {
    this.producto = data;
  }

  ngOnInit(): void {
    if (this.producto) {
      this.producto = {
        ...this.producto,
        imagenes: Array.isArray(this.producto?.imagenes)
          ? this.producto.imagenes.filter(
              (img: any, index: number, arr: any[]) =>
                img &&
                img.urlImagen &&
                arr.findIndex(x => x && x.urlImagen === img.urlImagen) === index
            )
          : this.producto?.imagenes,
      };
      this.selectedImagenIndex = 0;
      this.startAutoSlide();
    }
  }

  ngOnDestroy(): void {
    this.clearAutoSlide();
  }

  close(): void {
    this.dialogRef.close();
  }

  cotizar(): void {
    if (!this.authService.isAuthenticated()) {
      this.dialogRef.close();
      this.router.navigate(['/login']);
      return;
    }

    if (this.producto) {
      this.cotizacionService.agregarProducto(this.producto);
    }

    this.dialogRef.close();
    this.router.navigate(['/mis-cotizaciones']);
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
    this.selectedImagenIndex = (this.selectedImagenIndex - 1 + total) % total;
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
}
