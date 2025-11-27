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
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private loaderService: LoaderService,
    private router: Router
  ) {}

  cerrarSesion() {
    // Cierra sesión y redirige al index (home público)
    this.authService.logout('/');
  }

  toggleMenu() {
    this.toggleSidebar.emit();
  }
}

