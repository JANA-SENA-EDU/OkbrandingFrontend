import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { CotizacionService } from '../../../services/cotizacion.service';

@Component({
  selector: 'app-client-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatBadgeModule],
  templateUrl: './client-navbar.component.html',
  styleUrls: ['./client-navbar.component.css'],
})
export class ClientNavbarComponent {
  @Input() showSectionLinks = false;

  cotizacionCount = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private cotizacionService: CotizacionService
  ) {
    this.cotizacionService.items$.subscribe((items) => {
      this.cotizacionCount = items.reduce((acum, item) => acum + (item.cantidad || 0), 0);
    });
  }

  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  goToMisCotizaciones(): void {
    this.router.navigate(['/mis-cotizaciones']);
  }

  logout(): void {
    this.authService.logout('/');
  }

  async scrollToSection(sectionId: string): Promise<void> {
    const navigateHome = this.router.url !== '/';
    if (navigateHome) {
      await this.router.navigate(['/']);
      setTimeout(() => this.scrollToElement(sectionId), 300);
    } else {
      this.scrollToElement(sectionId);
    }
  }

  private scrollToElement(sectionId: string): void {
    if (typeof document === 'undefined') {
      return;
    }

    const element = document.getElementById(sectionId);
    if (!element) {
      return;
    }

    const headerOffset = 90;
    const rect = element.getBoundingClientRect();
    const targetY = window.scrollY + rect.top - headerOffset;
    this.animateScrollTo(targetY, 650);
  }

  private animateScrollTo(targetY: number, duration = 650): void {
    const startY = window.scrollY || window.pageYOffset;
    const distance = targetY - startY;

    if (distance === 0 || duration <= 0) {
      window.scrollTo(0, targetY);
      return;
    }

    const startTime = performance.now();
    const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutQuad(progress);
      window.scrollTo(0, startY + distance * eased);

      if (elapsed < duration) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }
}

