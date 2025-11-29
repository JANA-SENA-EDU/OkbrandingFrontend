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
  }      
