import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { LoginResponse } from '../models/login-response.model';
import { LoginRequest } from '../models/login-request.model';
import { Router } from '@angular/router';
import { LoaderService } from '../../shared/services/loader.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router:Router, private loaderService:LoaderService) {}

  private baseUrl = `${environment.apiUrl}/auth`; 
  private sidebarState = new BehaviorSubject<boolean>(false);

  private tokenKey = 'auth_token';
  sidebarVisible: boolean = false;

   
   //  Método para hacer login
   login(loginRequest: LoginRequest): Observable<LoginResponse> {
  return this.http.post<LoginResponse>(`${this.baseUrl}/login`, loginRequest);
}

  //  Método para registrar usuario
  registrarUsuario(usuario: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/registrar`, usuario);
  }

  //  Manejo del token en localStorage
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken(); // Retorna true si hay un token, false si no
  }

  //  Método para cerrar sesión
  logout(): void {
    this.removeToken();
    this.router.navigate(['/login']); // Redirige a la pantalla de login
  }

  // 🔹 Métodos para manejar el sidebar
  toggleSidebar(): void {
    this.sidebarState.next(!this.sidebarState.value);
  }

  getSidebarState(): Observable<boolean> {
    return this.sidebarState.asObservable();
  }


}
