import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { LoginResponse } from '../models/login-response.model';
import { LoginRequest } from '../models/login-request.model';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AlertService } from '../../shared/services/alert.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/auth`;
  private sidebarState = new BehaviorSubject<boolean>(false);
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';
  private currentUserSubject = new BehaviorSubject<LoginResponse | null>(
    this.loadUserFromStorage()
  );
  readonly currentUser$ = this.currentUserSubject.asObservable();
  sidebarVisible: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private alertService: AlertService
  ) {}

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, loginRequest);
  }

  registrarUsuario(usuario: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, usuario);
  }

  setToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  removeToken(): void {
    sessionStorage.removeItem(this.tokenKey);
  }

  setUser(user: LoginResponse): void {
    sessionStorage.setItem(this.userKey, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private loadUserFromStorage(): LoginResponse | null {
    try {
      const raw = sessionStorage.getItem(this.userKey);
      return raw ? (JSON.parse(raw) as LoginResponse) : null;
    } catch {
      return null;
    }
  }

  getCurrentUser(): LoginResponse | null {
    return this.currentUserSubject.value;
  }

  clearUser(): void {
    sessionStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(redirectTo: string = '/'): void {
    this.alertService
      .success('Sesión cerrada con éxito', '¡Hasta pronto!')
      .then(() => {
        this.removeToken();
        this.clearUser();
        this.router.navigate([redirectTo]);
      });
  }

  toggleSidebar(): void {
    this.sidebarState.next(!this.sidebarState.value);
  }

  getSidebarState(): Observable<boolean> {
    return this.sidebarState.asObservable();
  }
}
