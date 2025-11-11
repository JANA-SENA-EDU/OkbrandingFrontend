import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Categoria } from '../models/categoria.model';
import { Observable } from 'rxjs';
import { LoaderService } from '../../shared/services/loader.service';
import { AlertService } from '../../shared/services/alert.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private baseUrl = 'http://localhost:8080/okBranding/categorias';

  constructor(
  private http: HttpClient,
  private loaderService: LoaderService,
  private alertService: AlertService
  ) {

  }

  listar(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.baseUrl);
  }

  guardar(categoria: Categoria): Observable<Categoria> {
  this.loaderService.show();
  return new Observable(observer => {
    this.http.post<Categoria>(this.baseUrl, categoria).subscribe({
      next: (nuevaCategoria) => {
        this.loaderService.hide();
        this.alertService.success('¡Categoría agregada exitosamente!');
        observer.next(nuevaCategoria);
        observer.complete();
      },
      error: (error) => {
        this.loaderService.hide();
        this.alertService.error('Error al agregar la categoría', error.message);
        observer.error(error);
      }
    });
  });
}

  actualizar(categoria: Categoria): Observable<Categoria> {
  this.loaderService.show();
  return new Observable(observer => {
    this.http.put<Categoria>(`${this.baseUrl}/${categoria.idCategoria}`, categoria).subscribe({
      next: (categoriaActualizada) => {
        this.loaderService.hide();
        this.alertService.success('¡Categoría actualizada exitosamente!');
        observer.next(categoriaActualizada);
        observer.complete();
      },
      error: (error) => {
        this.loaderService.hide();
        this.alertService.error('Error al actualizar la categoría', error.message);
        observer.error(error);
      }
    });
  });
}

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
