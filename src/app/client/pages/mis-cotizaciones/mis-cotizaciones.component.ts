import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { CotizacionService } from '../../../services/cotizacion.service';
import {
  Cotizacion,
  CotizacionCarritoItem,
  CotizacionPayload,
} from '../../../services/models/cotizacion.model';
import { AuthService } from '../../../auth/services/auth.service';
import { AlertService } from '../../../shared/services/alert.service';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-mis-cotizaciones',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    FooterComponent,
  ],
  templateUrl: './mis-cotizaciones.component.html',
  styleUrls: ['./mis-cotizaciones.component.css'],
})
export class MisCotizacionesComponent implements OnInit {
  @ViewChild('detalleSection') detalleSection?: ElementRef<HTMLDivElement>;
  productosActuales: CotizacionCarritoItem[] = [];
  comentarioSolicitud = '';
  carritoPagina = 1;
  carritoPageSize = 3;

  cotizaciones: Cotizacion[] = [];
  historialPagina = 1;
  historialPageSize = 4;
  historialFiltroEstado = 'todas';
  cotizacionSeleccionada?: Cotizacion;
  ajustesCliente: Record<number, number> = {};
  cantidadesOriginales: Record<number, number> = {};
  comentarioAjuste = '';
  comentarioAceptacion = '';
  cargandoHistorial = false;
  cargandoListado = false;

  constructor(
    private cotizacionService: CotizacionService,
    private authService: AuthService,
    private alertService: AlertService,
    private router: Router
  ) {
    this.cotizacionService.items$.subscribe((items) => {
      this.productosActuales = items.map((item) => ({
        ...item,
        coloresSeleccionados: item.coloresSeleccionados || [],
      }));
    });
  }

  ngOnInit(): void {
    this.cargarCotizaciones();
  }

  get usuarioActual() {
    return this.authService.getCurrentUser();
  }

  get totalCarrito(): number {
    return this.productosActuales.reduce((acc, item) => acc + item.cantidad, 0);
  }

  get totalPaginasCarrito(): number {
    return Math.max(
      1,
      Math.ceil(this.productosActuales.length / this.carritoPageSize)
    );
  }

  get productosPaginados(): CotizacionCarritoItem[] {
    const start = (this.carritoPagina - 1) * this.carritoPageSize;
    return this.productosActuales.slice(start, start + this.carritoPageSize);
  }

  get estadosDisponibles(): string[] {
    const estados = new Set(
      this.cotizaciones.map((c) => c.estadoCotizacion || 'SIN_ESTADO')
    );
    return ['todas', ...Array.from(estados)];
  }

  get cotizacionesFiltradas(): Cotizacion[] {
    const filtradas =
      this.historialFiltroEstado === 'todas'
        ? this.cotizaciones
        : this.cotizaciones.filter(
            (cot) => cot.estadoCotizacion === this.historialFiltroEstado
          );

    return [...filtradas].sort((a, b) => {
      const fechaA = a.fechaSolicitud ? new Date(a.fechaSolicitud).getTime() : 0;
      const fechaB = b.fechaSolicitud ? new Date(b.fechaSolicitud).getTime() : 0;
      return fechaB - fechaA;
    });
  }

  get totalPaginasHistorial(): number {
    return Math.max(
      1,
      Math.ceil(this.cotizacionesFiltradas.length / this.historialPageSize)
    );
  }

  get cotizacionesPaginadas(): Cotizacion[] {
    const start = (this.historialPagina - 1) * this.historialPageSize;
    return this.cotizacionesFiltradas.slice(
      start,
      start + this.historialPageSize
    );
  }

  cargarCotizaciones(): void {
    const usuario = this.usuarioActual;
    if (!usuario) {
      this.cotizaciones = [];
      this.cotizacionSeleccionada = undefined;
      return;
    }
    this.cargandoListado = true;
    this.cotizacionService.listarCotizaciones().subscribe({
      next: (data) => {
        this.cotizaciones = data.filter(
          (cot) => cot.usuario?.idUsuario === usuario.idUsuario
        );
        this.historialPagina = 1;
        if (this.cotizacionSeleccionada) {
          this.cotizacionSeleccionada =
            this.cotizaciones.find(
              (c) => c.idCotizacion === this.cotizacionSeleccionada?.idCotizacion
            ) || undefined;
          if (this.cotizacionSeleccionada) {
            this.prepararAjustes(this.cotizacionSeleccionada);
          }
        }
        this.cargandoListado = false;
      },
      error: () => {
        this.alertService.error('No fue posible obtener tus cotizaciones');
        this.cargandoListado = false;
      },
    });
  }

  actualizarCantidadCarrito(
    item: CotizacionCarritoItem,
    nuevaCantidad: number
  ): void {
    if (nuevaCantidad <= 0) {
      this.eliminarProductoCarrito(item.idProducto);
      return;
    }
    this.cotizacionService.actualizarCantidad(item.idProducto, nuevaCantidad);
  }

  eliminarProductoCarrito(idProducto: number): void {
    this.cotizacionService.eliminarProducto(idProducto);
    if (this.carritoPagina > this.totalPaginasCarrito) {
      this.carritoPagina = this.totalPaginasCarrito;
    }
  }

  seguirAgregandoProductos(): void {
    this.router.navigate(['/']);
  }

  crearNuevaCotizacion(): void {
    this.cancelarBorrador();
    this.router.navigate(['/']);
  }

  cancelarBorrador(): void {
    this.cotizacionService.limpiar();
    this.comentarioSolicitud = '';
  }

  actualizarDetalleCarrito(
    idProducto: number,
    cambios: Partial<
      Pick<CotizacionCarritoItem, 'coloresSeleccionados' | 'comentarioCliente'>
    >
  ): void {
    this.cotizacionService.actualizarDetalleProducto(idProducto, cambios);
  }

  toggleColorSeleccionado(
    producto: CotizacionCarritoItem,
    color: { nombreColor?: string; codigoColor?: string }
  ): void {
    const valor = color.nombreColor || color.codigoColor || '';
    if (!valor) {
      return;
    }
    const actuales = producto.coloresSeleccionados || [];
    const existe = actuales.includes(valor);
    const actualizadas = existe
      ? actuales.filter((c) => c !== valor)
      : [...actuales, valor];
    this.actualizarDetalleCarrito(producto.idProducto, {
      coloresSeleccionados: actualizadas,
    });
  }

  esColorSeleccionado(
    producto: CotizacionCarritoItem,
    color: { nombreColor?: string; codigoColor?: string }
  ): boolean {
    const valor = color.nombreColor || color.codigoColor || '';
    return (producto.coloresSeleccionados || []).includes(valor);
  }

  async mandarCotizacion(): Promise<void> {
    if (!this.usuarioActual) {
      this.alertService.warning('Debes iniciar sesion para cotizar.');
      return;
    }
    if (!this.productosActuales.length) {
      this.alertService.warning(
        'Agrega al menos un producto antes de solicitar una cotizacion.'
      );
      return;
    }
    const productosSinColor = this.productosActuales.filter(
      (item) =>
        (item.coloresDisponibles?.length || 0) > 0 &&
        !(item.coloresSeleccionados && item.coloresSeleccionados.length)
    );
    if (productosSinColor.length) {
      this.alertService.warning(
        'Selecciona un color para cada producto antes de enviar la cotizacion.'
      );
      return;
    }
    const confirmado = await this.alertService.confirm(
      'Deseas enviar la cotizacion? No podras agregar productos nuevos a esta solicitud una vez enviada.',
      'Confirmar envio',
      'Enviar',
      'Cancelar'
    );
    if (!confirmado) {
      return;
    }

    const payload: CotizacionPayload = {
      usuario: { idUsuario: this.usuarioActual!.idUsuario },
      productos: this.productosActuales.map((item) => ({
        idProducto: item.idProducto,
        cantidad: item.cantidad,
        coloresSeleccionados:
          item.coloresSeleccionados && item.coloresSeleccionados.length
            ? item.coloresSeleccionados
            : undefined,
        comentarioCliente: item.comentarioCliente?.trim()
          ? item.comentarioCliente.trim()
          : undefined,
      })),
    };

    if (this.comentarioSolicitud.trim()) {
      payload.comentarios = [{ comentario: this.comentarioSolicitud.trim() }];
    }

    this.cotizacionService.crearCotizacion(payload).subscribe({
      next: (cotizacion) => {
        this.alertService.success('Cotizacion enviada al administrador.');
        this.cotizacionService.limpiar();
        this.comentarioSolicitud = '';
        this.cotizacionSeleccionada = cotizacion;
        this.prepararAjustes(cotizacion);
        this.cargarCotizaciones();
      },
      error: (err) => {
        const mensaje =
          err.error?.message || 'No se pudo registrar la cotizacion.';
        this.alertService.error(mensaje);
      },
    });
  }

  seleccionarCotizacion(cotizacion: Cotizacion): void {
    this.cotizacionSeleccionada = cotizacion;
    this.prepararAjustes(cotizacion);
    this.enfocarDetalle();
  }

  enfocarDetalle(): void {
    if (!this.detalleSection) {
      return;
    }
    setTimeout(() => {
      this.detalleSection?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 150);
  }

  private prepararAjustes(cotizacion: Cotizacion): void {
    this.ajustesCliente = {};
    this.cantidadesOriginales = {};
    cotizacion.productos.forEach((producto) => {
      this.ajustesCliente[producto.idProducto] = producto.cantidad;
      this.cantidadesOriginales[producto.idProducto] = producto.cantidad;
    });
    this.comentarioAjuste = '';
    this.comentarioAceptacion = '';
  }

  desactivarProducto(productoId: number): void {
    this.ajustesCliente[productoId] = 0;
  }

  async enviarAjustes(): Promise<void> {
    if (
      !this.cotizacionSeleccionada ||
      !this.cotizacionSeleccionada.permiteAjusteCliente
    ) {
      return;
    }
    if (!this.usuarioActual) {
      this.alertService.warning('Debes iniciar sesion para ajustar.');
      return;
    }
    const productos = Object.entries(this.ajustesCliente).map(
      ([idProducto, cantidad]) => ({
        idProducto: Number(idProducto),
        cantidad: Number(cantidad),
      })
    );
    const ajustesInvalidos = productos.some((producto) => {
      const cantidadOriginal = this.cantidadesOriginales[producto.idProducto];
      return (
        typeof cantidadOriginal === 'number' &&
        producto.cantidad > 0 &&
        producto.cantidad < cantidadOriginal
      );
    });
    if (ajustesInvalidos) {
      this.alertService.warning(
        'Solo puedes eliminar productos o aumentar sus cantidades despues de la respuesta.'
      );
      return;
    }
    const confirmado = await this.alertService.confirm(
      'Deseas enviar los ajustes al administrador?',
      'Confirmar ajustes',
      'Enviar',
      'Cancelar'
    );
    if (!confirmado) {
      return;
    }

    const payload: CotizacionPayload = {
      usuario: { idUsuario: this.usuarioActual.idUsuario },
      productos,
    };

    if (this.comentarioAjuste.trim()) {
      payload.comentarios = [{ comentario: this.comentarioAjuste.trim() }];
    }

    this.cotizacionService
      .ajustarCotizacionCliente(
        this.cotizacionSeleccionada.idCotizacion,
        payload
      )
      .subscribe({
        next: (cotizacion) => {
          this.alertService.success('Se enviaron los ajustes al administrador.');
          this.cotizacionSeleccionada = cotizacion;
          this.prepararAjustes(cotizacion);
          this.comentarioAceptacion = '';
          this.cargarCotizaciones();
        },
        error: (err) => {
          const mensaje =
            err.error?.message ||
            'No se pudo actualizar la cotizacion con tus ajustes.';
          this.alertService.error(mensaje);
        },
      });
  }

  async aceptarCotizacion(): Promise<void> {
    if (
      !this.cotizacionSeleccionada ||
      this.cotizacionSeleccionada.estadoCotizacion !== 'RESPONDIDA'
    ) {
      return;
    }
    if (!this.usuarioActual) {
      this.alertService.warning(
        'Debes iniciar sesion para aceptar la cotizacion.'
      );
      return;
    }
    const confirmado = await this.alertService.confirm(
      'Confirmas que aceptas la cotizacion? No podras realizar mas cambios y se iniciara la gestion del pedido.',
      'Confirmar aceptacion',
      'Aceptar',
      'Cancelar'
    );
    if (!confirmado) {
      return;
    }

    const payload: CotizacionPayload = {
      usuario: { idUsuario: this.usuarioActual.idUsuario },
    };

    if (this.comentarioAceptacion.trim()) {
      payload.comentarios = [{ comentario: this.comentarioAceptacion.trim() }];
    }

    this.cotizacionService
      .aceptarCotizacion(this.cotizacionSeleccionada.idCotizacion, payload)
      .subscribe({
        next: (cotizacion) => {
          this.alertService.success('Se acepto la cotizacion correctamente.');
          this.cotizacionSeleccionada = cotizacion;
          this.prepararAjustes(cotizacion);
          this.comentarioAceptacion = '';
          this.cargarCotizaciones();
        },
        error: (err) => {
          const mensaje =
            err.error?.message || 'No fue posible registrar la aceptacion.';
          this.alertService.error(mensaje);
        },
      });
  }

  puedeCancelarCotizacionSeleccionada(): boolean {
    if (!this.cotizacionSeleccionada) {
      return false;
    }
    return !['CERRADA', 'CANCELADA'].includes(
      this.cotizacionSeleccionada.estadoCotizacion
    );
  }

  async cancelarCotizacionSeleccionada(): Promise<void> {
    if (!this.cotizacionSeleccionada) {
      return;
    }
    if (!this.usuarioActual) {
      this.alertService.warning('Debes iniciar sesion para cancelar.');
      return;
    }
    const estado = this.cotizacionSeleccionada.estadoCotizacion;
    if (['CERRADA', 'CANCELADA'].includes(estado)) {
      this.alertService.info('Esta cotizacion ya se encuentra cerrada.');
      return;
    }
    const confirmado = await this.alertService.confirm(
      '¿Deseas cancelar esta cotizacion? No podras continuar con su gestion.',
      'Cancelar cotizacion',
      'Cancelar cotizacion',
      'Volver'
    );
    if (!confirmado) {
      return;
    }

    const payload: CotizacionPayload = {
      usuario: { idUsuario: this.usuarioActual.idUsuario },
    };

    this.cotizacionService
      .cancelarCotizacion(this.cotizacionSeleccionada.idCotizacion, payload)
      .subscribe({
        next: (cotizacion) => {
          this.alertService.success('Cotizacion cancelada correctamente.');
          this.cotizacionSeleccionada = cotizacion;
          this.prepararAjustes(cotizacion);
          this.cargarCotizaciones();
        },
        error: (err) => {
          const mensaje =
            err.error?.message || 'No se pudo cancelar la cotizacion.';
          this.alertService.error(mensaje);
        },
      });
  }

  cambiarPaginaCarrito(offset: number): void {
    const nueva = this.carritoPagina + offset;
    if (nueva >= 1 && nueva <= this.totalPaginasCarrito) {
      this.carritoPagina = nueva;
    }
  }

  cambiarPaginaHistorial(offset: number): void {
    const nueva = this.historialPagina + offset;
    if (nueva >= 1 && nueva <= this.totalPaginasHistorial) {
      this.historialPagina = nueva;
    }
  }

  aplicarFiltroEstado(filtro: string): void {
    this.historialFiltroEstado = filtro;
    this.historialPagina = 1;
  }
}
