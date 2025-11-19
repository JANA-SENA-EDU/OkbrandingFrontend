import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../auth/services/auth.service';
import { CotizacionService } from '../../services/cotizacion.service';

@Component({                                                                                                             
    selector: 'app-producto-detalle',                                                                                      
    standalone: true,                                                                                                      
    imports: [CommonModule, MatCardModule, RouterModule, MatButtonModule],                                                 
    templateUrl: './producto-detalle.component.html',                                                                      
    styleUrls: ['./producto-detalle.component.css']                                                                        
  })  
export class ProductoDetalleComponent implements OnInit {
  producto: any;

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private router: Router,
    private authService: AuthService,
    private cotizacionService: CotizacionService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.productoService.obtenerPorId(id).subscribe(
        data => this.producto = data,
        err => this.router.navigate(['/']) // Redirige si no existe
      );
    }
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
  cotizar(): void {                                                                                                        
    if (!this.authService.isAuthenticated()) {                                                                             
      this.router.navigate(['/login']);                                                                                    
      return;                                                                                                              
    }                                                                                                                      
                                                                                                                           
    if (this.producto) {                                                                                                   
      this.cotizacionService.agregarProducto(this.producto);                                                               
    }                                                                                                                      
                                                                                                                           
    this.router.navigate(['/mis-cotizaciones']);                                                                           
  }
}