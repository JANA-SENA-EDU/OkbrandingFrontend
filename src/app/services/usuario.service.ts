import { Injectable } from '@angular/core';
import { LoaderService } from '../shared/services/loader.service';
import { AlertService } from '../shared/services/alert.service';
import { HttpClient } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:8080/okBranding/usuarios'; 
  constructor(
    private http: HttpClient,
    private loaderService: LoaderService,
    private alertService: AlertService
  ) { }

  listarUsuarios(): Observable<any> {
    this.loaderService.show();
    return new Observable(observer => {
      this.http.get<any[]>(`${this.apiUrl}/listar`).subscribe({
        next: (usuarios) => {
          this.loaderService.hide();
          observer.next(usuarios);
          observer.complete();
        },
        error: (error) => {
          this.loaderService.hide();
          this.alertService.error('Error al listar usuarios', error.message);
          observer.error(error);
        }
      });
    });
  }

  registrarUsuario(usuario: any): Observable<any> {
    this.loaderService.show();
    return new Observable(observer => {
      this.http.post(`${this.apiUrl}/registrar`, usuario).subscribe({
        next: (response) => {
          this.loaderService.hide();
          this.alertService.success('Usuario registrado exitosamente');
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          this.loaderService.hide();
          this.alertService.error('Error al registrar usuario', error.message);
          observer.error(error);
        }
      });
    });
  }

  actualizarUsuario(idUsuario: number, usuario: any): Observable<any> {
    this.loaderService.show();
    return new Observable(observer => {
      this.http.put(`${this.apiUrl}/actualizar/${idUsuario}`, usuario).subscribe({
        next: (response) => {
          this.loaderService.hide();
          this.alertService.success('Usuario actualizado exitosamente');
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          this.loaderService.hide();
          this.alertService.error('Error al actualizar usuario', error.message);
          observer.error(error);
        }
      });
    });
  }

  eliminarUsuario(idUsuario: number): Observable<any> {
    this.loaderService.show();
    return this.http.delete(`${this.apiUrl}/eliminar/${idUsuario}`).pipe(
      finalize(() => this.loaderService.hide()),
      tap(() => this.alertService.success('Usuario desactivado exitosamente')),
      catchError((error) => {
        this.alertService.error('Error al desactivar usuario', error.message);
        return throwError(() => error);
      })
    );
  }
  
}
