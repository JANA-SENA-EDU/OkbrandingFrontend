import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { AlertService } from '../../../shared/services/alert.service';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Validador personalizado para comparar contraseñas
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  if (!password || !confirmPassword) {
    return null; // No validar si alguno está vacío
  }
  return password === confirmPassword ? null : { passwordMismatch: true };
};

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
  ]
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) {
    this.registerForm = this.fb.group({
  username: ['', Validators.required],
  password: ['', [Validators.required, Validators.minLength(6)]],
  confirmPassword: ['', Validators.required],
  nombre: ['', Validators.required],
  correo: ['', [Validators.required, Validators.email]],
  telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]]
}, { validators: passwordMatchValidator }); // <-- Aplica el validador aquí
  this.registerForm.get('password')?.valueChanges.subscribe(() => {
  this.registerForm.updateValueAndValidity();
});
this.registerForm.get('confirmPassword')?.valueChanges.subscribe(() => {
  this.registerForm.updateValueAndValidity();
});
  }

  registrarse() {
  // Primero, marca todos los campos como tocados
  this.registerForm.markAllAsTouched();

  // 1. Valida campos requeridos y formato
  if (
    this.registerForm.get('username')?.invalid ||
    this.registerForm.get('password')?.invalid ||
    this.registerForm.get('confirmPassword')?.invalid ||
    this.registerForm.get('nombre')?.invalid ||
    this.registerForm.get('correo')?.invalid ||
    this.registerForm.get('telefono')?.invalid
  ) {
    this.alertService.warning('Debes llenar todos los campos obligatorios.');
    return;
  }

  // 2. Valida coincidencia de contraseñas
  if (this.registerForm.hasError('passwordMismatch')) {
    this.alertService.warning('Las contraseñas no coinciden.');
    return;
  }

  const userData = this.registerForm.value;

   this.authService.registrarUsuario(userData).subscribe({
    next: (res) => {
      // Si llegó aquí, el registro fue exitoso (HTTP 201)
      this.alertService.success('Registro exitoso', 'Usuario registrado correctamente.');
      this.router.navigate(['/login']);
    },
    error: (err) => {
      // El backend devuelve un string en el body cuando hay error
      const mensaje = err.error || 'Error inesperado al registrar';
      this.alertService.error('Error', mensaje);
    }
  });
  }

  permitirSoloNumeros(event: KeyboardEvent) {
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }

  limitarLongitud() {
    const control = this.registerForm.get('telefono');
    if (control) {
      let valor = control.value || '';
      valor = valor.replace(/[^0-9]/g, '');
      if (valor.length > 10) {
        valor = valor.slice(0, 10);
        control.setValue(valor, { emitEvent: false });
      }
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
