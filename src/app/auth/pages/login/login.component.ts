import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/login-request.model';
import { AlertService } from '../../../shared/services/alert.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LoaderService } from '../../../shared/services/loader.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
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
      password: ['', Validators.required]
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

  // ✅ Ahora el backend devuelve directamente el token y los datos
  if (response && response.token) {
    this.authService.setToken(response.token);
    this.alertService.success(`Bienvenido, ${response.nombre}`);
    this.router.navigate(['/admin']);
  } else {
    this.alertService.error('Error inesperado en la respuesta del servidor.');
  }
  },
      error: (error) => {
        this.loaderService.hide();
        const message = error.error?.message || 'Error al iniciar sesión.';
        this.alertService.error(message);
      }
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.login();
    }
  }
}
