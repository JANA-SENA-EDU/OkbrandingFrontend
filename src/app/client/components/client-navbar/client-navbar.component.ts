import { Component } from '@angular/core';                                                                               
  import { CommonModule } from '@angular/common';                                                                          
  import { Router, RouterModule } from '@angular/router';                                                                  
  import { MatButtonModule } from '@angular/material/button';                                                              
  import { MatIconModule } from '@angular/material/icon';                                                                  
  import { MatBadgeModule } from '@angular/material/badge';                                                                
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
    cotizacionCount = 0;                                                                                                   
                                                                                                                           
    constructor(                                                                                                           
      private router: Router,                                                                                              
      private authService: AuthService,                                                                                    
      private cotizacionService: CotizacionService                                                                         
    ) {
      this.cotizacionService.items$.subscribe(items => {
        this.cotizacionCount = items.reduce(
          (acum, item) => acum + (item.cantidad || 0),
          0
        );
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
    
     scrollToAbout(): void {
    const doScroll = () => {
      const el = document.getElementById('nosotros');
      if (!el) {
        return;
      }
      const navbarHeight = 64; // same height as .client-header
      const extraOffset = 60; // move a bit further down to avoid seeing the blue section
      const rect = el.getBoundingClientRect();
      const targetY = window.scrollY + rect.top - navbarHeight + extraOffset;
      this.animateScrollTo(targetY, 700);
    };
  }   

   private animateScrollTo(targetY: number, duration = 700): void {
    const startY = window.scrollY || window.pageYOffset;
    const distance = targetY - startY;
    if (distance === 0 || duration <= 0) {
      window.scrollTo(0, targetY);
      return;
    }

    const startTime = performance.now();

    const easeInOutQuad = (t: number) =>
      t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

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

