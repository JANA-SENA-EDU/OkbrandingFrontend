import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { AlertService } from '../../../shared/services/alert.service';
import { LoaderService } from '../../../shared/services/loader.service';

@Component({
  selector: 'app-navbar', // ítem corregido
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'] // ítem corregido (era styleUrl)
})
export class NavbarComponent { // ítem corregido (era NavarComponent)

  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private loaderService: LoaderService,
    private router: Router
  ) {}

  cerrarSesion() {
    // Cierra sesión y redirige al login
    this.authService.logout('/login');
  }

  toggleMenu() {
    this.toggleSidebar.emit();
  }
}
