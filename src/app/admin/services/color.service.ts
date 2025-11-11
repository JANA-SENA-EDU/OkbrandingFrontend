import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoaderService } from '../../shared/services/loader.service';
import { AlertService } from '../../shared/services/alert.service';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  private apiUrl = 'http://localhost:8080/okBranding/colores';

  constructor(
    private http: HttpClient,
    private loaderService: LoaderService,
    private alertService: AlertService
  ) {}

  listarColores(): Observable<any> {
    this.loaderService.show();
    return new Observable(observer => {
      this.http.get<any[]>(`${this.apiUrl}/listar`).subscribe({
        next: (colores) => {
          this.loaderService.hide();
          observer.next(colores);
          observer.complete();
        },
        error: (error) => {
          this.loaderService.hide();
          this.alertService.error('Error al listar colores', error.message);
          observer.error(error);
        }
      });
    });
  }

  registrarColor(color: any): Observable<any> {
    this.loaderService.show();
    return new Observable(observer => {
      this.http.post(`${this.apiUrl}/registrar`, color).subscribe({
        next: (response) => {
          this.loaderService.hide();
          this.alertService.success('Color registrado exitosamente');
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          this.loaderService.hide();
          this.alertService.error('Error al registrar color', error.message);
          observer.error(error);
        }
      });
    });
  }

  actualizarColor(idColor: number, color: any): Observable<any> {
    this.loaderService.show();
    return new Observable(observer => {
      this.http.put(`${this.apiUrl}/actualizar/${idColor}`, color).subscribe({
        next: (response) => {
          this.loaderService.hide();
          this.alertService.success('Color actualizado exitosamente');
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          this.loaderService.hide();
          this.alertService.error('Error al actualizar color', error.message);
          observer.error(error);
        }
      });
    });
  }

  eliminarColor(idColor: number): Observable<any> {
    this.loaderService.show();
    return this.http.delete(`${this.apiUrl}/eliminar/${idColor}`).pipe(
      finalize(() => this.loaderService.hide()),
      tap(() => this.alertService.success('Color eliminado exitosamente')),
      catchError((error) => {
        this.alertService.error('Error al eliminar color', error.message);
        return throwError(() => error);
      })
    );
  }
}