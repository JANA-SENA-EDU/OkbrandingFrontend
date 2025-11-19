import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { CotizacionService } from '../../../services/cotizacion.service';

interface CotizacionEnviada {
  codigo: string;
  fecha: string;
  estado: string;
  resumen: string;
}

@Component({
  selector: 'app-mis-cotizaciones',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './mis-cotizaciones.component.html',
  styleUrls: ['./mis-cotizaciones.component.css'],
})
export class MisCotizacionesComponent {
  productosActuales: any[] = [];

  cotizacionesEnviadas: CotizacionEnviada[] = [
    {
      codigo: 'COT-001',
      fecha: '10/11/2025',
      estado: 'En revisión',
      resumen: '3 productos para branding de oficina',
    },
    {
      codigo: 'COT-002',
      fecha: '05/11/2025',
      estado: 'Respondida',
      resumen: '2 productos para evento corporativo',
    },
  ];

  constructor(private cotizacionService: CotizacionService) {
    this.cotizacionService.items$.subscribe((items) => {
      this.productosActuales = items;
    });
  }

  mandarCotizacion(): void {
    if (!this.productosActuales.length) {
      return;
    }

    const nueva: CotizacionEnviada = {
      codigo: `COT-${(this.cotizacionesEnviadas.length + 1)
        .toString()
        .padStart(3, '0')}`,
      fecha: new Date().toLocaleDateString(),
      estado: 'Enviada',
      resumen: `${this.productosActuales.length} producto(s) enviado(s) desde la web`,
    };

    this.cotizacionesEnviadas = [nueva, ...this.cotizacionesEnviadas];
    this.cotizacionService.limpiar();
  }
}
