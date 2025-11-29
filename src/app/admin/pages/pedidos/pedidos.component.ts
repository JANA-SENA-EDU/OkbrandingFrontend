import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CotizacionService } from '../../../services/cotizacion.service';
import {
  Cotizacion,
  CotizacionPayload,
} from '../../../services/models/cotizacion.model';
import { AlertService } from '../../../shared/services/alert.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css'],
})
export class PedidosComponent implements OnInit {
  cotizaciones: Cotizacion[] = [];
  cotizacionSeleccionada?: Cotizacion;
  precios: Record<number, number> = {};
  comentarioRespuesta = '';
  filtroEstado = 'pendientes';
  cargando = false;

  constructor(
    private cotizacionService: CotizacionService,
    private alertService: AlertService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarCotizaciones();
  }

  get usuarioActual() {
    return this.authService.getCurrentUser();
  }

  get cotizacionesFiltradas(): Cotizacion[] {
    if (this.filtroEstado === 'todas') {
      return this.cotizaciones;
    }
    if (this.filtroEstado === 'canceladas') {
      return this.cotizaciones.filter(
        (cot) => cot.estadoCotizacion === 'CANCELADA'
      );
    }
    if (this.filtroEstado === 'respondidas') {
      return this.cotizaciones.filter((cot) =>
        ['RESPONDIDA', 'CERRADA'].includes(cot.estadoCotizacion)
      );
    }
    return this.cotizaciones.filter((cot) =>
      ['SOLICITADA', 'AJUSTADA_CLIENTE'].includes(cot.estadoCotizacion)
    );
  }

  cargarCotizaciones(): void {
    this.cargando = true;
    this.cotizacionService.listarCotizaciones().subscribe({
      next: (data) => {
        this.cotizaciones = data;
        if (this.cotizacionSeleccionada) {
          this.cotizacionSeleccionada =
            this.cotizaciones.find(
              (c) => c.idCotizacion === this.cotizacionSeleccionada?.idCotizacion
            ) || undefined;
          if (this.cotizacionSeleccionada) {
            this.prepararFormulario(this.cotizacionSeleccionada);
          }
        }
        this.cargando = false;
      },
      error: () => {
        this.alertService.error(
          'No fue posible cargar las cotizaciones registradas.'
        );
        this.cargando = false;
      },
    });
  }

  seleccionarCotizacion(cotizacion: Cotizacion): void {
    this.cotizacionSeleccionada = cotizacion;
    this.prepararFormulario(cotizacion);
  }

  private prepararFormulario(cotizacion: Cotizacion): void {
    this.precios = {};
    cotizacion.productos.forEach((producto) => {
      this.precios[producto.idProducto] = producto.precioUnitario || 0;
    });
    this.comentarioRespuesta = '';
  }

  puedeResponder(): boolean {
    if (!this.cotizacionSeleccionada) {
      return false;
    }
    return ['SOLICITADA', 'AJUSTADA_CLIENTE'].includes(
      this.cotizacionSeleccionada.estadoCotizacion
    );
  }

  enviarRespuesta(): void {
    if (!this.puedeResponder() || !this.cotizacionSeleccionada) {
      this.alertService.warning(
        'Selecciona una cotización pendiente para responder.'
      );
      return;
    }
    if (!this.usuarioActual) {
      this.alertService.error('No se encontró información del administrador.');
      return;
    }
    try {
      const productos = this.cotizacionSeleccionada.productos.map(
        (producto) => {
          const precio = Number(this.precios[producto.idProducto]);
          if (!precio || precio <= 0) {
            throw new Error(
              `Ingresa un precio válido para ${producto.nombreProducto}.`
            );
          }
          return {
            idProducto: producto.idProducto,
            precioUnitario: precio,
            cantidad: producto.cantidad,
          };
        }
      );

      const payload: CotizacionPayload = {
        usuario: { idUsuario: this.usuarioActual.idUsuario },
        productos,
      };

      if (this.comentarioRespuesta.trim()) {
        payload.comentarios = [
          { comentario: this.comentarioRespuesta.trim() },
        ];
      }

      this.cotizacionService
        .responderCotizacion(this.cotizacionSeleccionada.idCotizacion, payload)
        .subscribe({
          next: (cotizacion) => {
            this.alertService.success('Se envió la respuesta al cliente.');
            this.cotizacionSeleccionada = cotizacion;
            this.prepararFormulario(cotizacion);
            this.cargarCotizaciones();
          },
          error: (err) => {
            const mensaje =
              err.error?.message ||
              'No se pudo registrar la respuesta. Verifica los datos.';
            this.alertService.error(mensaje);
          },
        });
    } catch (error: any) {
      this.alertService.warning(error.message);
    }
  }

  estadoClase(estado: string): string {
    if (!estado) {
      return '';
    }
    return estado.toLowerCase().replace(/\s+/g, '_');
  }

  obtenerNombreColor(valor: string | null | undefined): string {
    if (!valor) {
      return 'Sin definir';
    }
    const limpio = valor.trim();
    if (!limpio) {
      return 'Sin definir';
    }
    return limpio.startsWith('#') ? `Color ${limpio}` : limpio;
  }
}
