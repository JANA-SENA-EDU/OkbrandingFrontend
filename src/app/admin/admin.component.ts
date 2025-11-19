import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { NavbarComponent } from './components/navbar/navbar.component';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';

import { LoaderService } from '../shared/services/loader.service';
import { AlertService } from '../shared/services/alert.service';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  isSidenavOpen = true;

  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(
    private loaderService: LoaderService,
    private authService: AuthService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('Token después de redirigir:', sessionStorage.getItem('auth_token'));
  }

  cerrarSesion() {
    // Cierra sesión y redirige al login
    this.authService.logout('/login');
  }
}

