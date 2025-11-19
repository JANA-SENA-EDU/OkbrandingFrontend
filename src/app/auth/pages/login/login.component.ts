import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/login-request.model';
import { AlertService } from '../../../shared/services/alert.service';
import { LoaderService } from '../../../shared/services/loader.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private alertService: AlertService,
    private loaderService: LoaderService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.alertService.warning('Completa todos los campos requeridos.');
      return;
    }

    const credentials: LoginRequest = this.loginForm.value;

    this.loaderService.show();
    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.loaderService.hide();

        if (response && response.token) {
          console.log('Respuesta de login:', response);
          this.authService.setToken(response.token);
          this.alertService.success(`Bienvenido, ${response.nombre}`);

          const rawRol: any =
            (response as any).rol ??
            (response as any).role ??
            (response as any).roles ??
            '';

          let rol = '';
          if (Array.isArray(rawRol)) {
            rol = rawRol.map((r) => String(r).toLowerCase()).join(',');
          } else {
            rol = String(rawRol).toLowerCase();
          }

          if (rol.includes('admin')) {
            console.log('Rol detectado como admin, navegando a /admin');
            this.router.navigate(['/admin']);
          } else {
            // Cliente: vuelve al inicio
            this.router.navigate(['/']);
          }
        } else {
          this.alertService.error(
            'Error inesperado en la respuesta del servidor.'
          );
        }
      },
      error: (error) => {
        this.loaderService.hide();
        const message =
          error.error?.message || 'Error al iniciar sesión.';
        this.alertService.error(message);
      },
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.login();
    }
  }

  goBack(): void {
    window.history.back();
  }
}
