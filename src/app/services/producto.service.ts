import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoaderService } from '../shared/services/loader.service';
import { AlertService } from '../shared/services/alert.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://localhost:8080/okBranding/productos';

  constructor(
    private http: HttpClient,
    private loaderService: LoaderService,
    private alertService: AlertService
  ) {}

  listarProductos(): Observable<any> {
    this.loaderService.show();
    return new Observable(observer => {
      this.http.get<any[]>(`${this.apiUrl}/listar`).subscribe({
        next: (productos) => {
          this.loaderService.hide();
          observer.next(productos);
          observer.complete();
        },
        error: (error) => {
          this.loaderService.hide();
          this.alertService.error('Error al listar productos', error.message);
          observer.error(error);
        }
      });
    });
  }

  listarPorCategoria(idCategoria: number): Observable<any> {
  return this.http.get<any[]>((`${this.apiUrl}/categoria/${idCategoria}`));
  }

  registrarProducto(producto: any): Observable<any> {
  this.loaderService.show();
  return new Observable(observer => {
    this.http.post(`${this.apiUrl}/registrar`, producto).subscribe({
      next: (response) => {
        this.loaderService.hide();
        this.alertService.success('Producto registrado exitosamente');
        observer.next(response);
        observer.complete();
      },
      error: (error) => {
        this.loaderService.hide();
        this.alertService.error('Error al registrar producto', error.message);
        observer.error(error);
      }
    });
  });
}
obtenerPorId(id: number) {
  return this.http.get<any>(`http://localhost:8080/okBranding/productos/${id}`);
}

actualizarProducto(producto: any): Observable<any> {
  this.loaderService.show();
  return new Observable(observer => {
    this.http.put(`${this.apiUrl}/actualizar`, producto).subscribe({
      next: (response) => {
        this.loaderService.hide();
        this.alertService.success('Producto actualizado exitosamente');
        observer.next(response);
        observer.complete();
      },
      error: (error) => {
        this.loaderService.hide();
        this.alertService.error('Error al actualizar producto', error.message);
        observer.error(error);
      }
    });
  });
}

eliminarProducto(id: number): Observable<any> {
  this.loaderService.show();
  return new Observable(observer => {
    this.http.delete(`${this.apiUrl}/eliminar/${id}`).subscribe({
      next: (response) => {
        this.loaderService.hide();
        this.alertService.success('Producto eliminado correctamente');
        observer.next(response);
        observer.complete();
      },
      error: (error) => {
        this.loaderService.hide();
        this.alertService.error('Error al eliminar producto', error.message);
        observer.error(error);
      }
    });
  });
}

}