import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoaderService } from '../shared/services/loader.service';
import { AlertService } from '../shared/services/alert.service';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EstadoProductoService {
  private apiUrl = 'http://localhost:8080/okBranding/estado-producto'; // ajusta si tu endpoint cambia

  constructor(
    private http: HttpClient,
    private loaderService: LoaderService,
    private alertService: AlertService
  ) {}

  listarEstados(): Observable<any> {
    this.loaderService.show();
    return new Observable(observer => {
      this.http.get<any[]>(`${this.apiUrl}/listar`).subscribe({
        next: (data) => {
          this.loaderService.hide();
          observer.next(data);
          observer.complete();
        },
        error: (error) => {
          this.loaderService.hide();
          this.alertService.error('Error al listar estados de producto', error.message);
          observer.error(error);
        }
      });
    });
  }

  registrarEstado(estado: any): Observable<any> {
    this.loaderService.show();
    return new Observable(observer => {
      this.http.post(`${this.apiUrl}/registrar`, estado).subscribe({
        next: (response) => {
          this.loaderService.hide();
          this.alertService.success('Estado registrado exitosamente');
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          this.loaderService.hide();
          this.alertService.error('Error al registrar estado', error.message);
          observer.error(error);
        }
      });
    });
  }

  actualizarEstado(estado: any): Observable<any> {
  this.loaderService.show();
  return new Observable(observer => {
    this.http.put(`${this.apiUrl}/actualizar`, estado).subscribe({
      next: (response) => {
        this.loaderService.hide();
        this.alertService.success('Estado actualizado exitosamente');
        observer.next(response);
        observer.complete();
      },
      error: (error) => {
        this.loaderService.hide();
        this.alertService.error('Error al actualizar estado', error.message);
        observer.error(error);
      }
    });
  });
}

  eliminarEstado(id: number): Observable<any> {
    this.loaderService.show();
    return this.http.delete(`${this.apiUrl}/eliminar/${id}`).pipe(
      finalize(() => this.loaderService.hide()),
      tap(() => this.alertService.success('Estado eliminado exitosamente')),
      catchError((error) => {
        this.alertService.error('Error al eliminar estado', error.message);
        return throwError(() => error);
      })
    );
  }
}
