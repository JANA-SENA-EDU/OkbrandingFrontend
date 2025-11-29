export interface UsuarioCotizacion {
  idUsuario: number;
  nombre?: string;
  correo?: string;
}

export interface CotizacionProducto {
  idProducto: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario?: number;
  subtotal?: number;
  coloresSeleccionados?: string[];
  comentarioCliente?: string;
}

export interface ComentarioCotizacion {
  idComentario?: number;
  idUsuario?: number;
  nombreUsuario?: string;
  comentario: string;
  fechaComentario?: string;
  esAdministrador?: boolean;
}

export interface HistorialCotizacion {
  idHistorial?: number;
  estadoAnterior?: string;
  estadoNuevo: string;
  usuarioAccion?: string;
  fechaCambio?: string;
  descripcionCambio?: string;
}

export interface Cotizacion {
  idCotizacion: number;
  fechaSolicitud: string;
  estadoCotizacion: string;
  montoTotal: number;
  permiteAjusteCliente: boolean;
  usuario: UsuarioCotizacion;
  productos: CotizacionProducto[];
  comentarios: ComentarioCotizacion[];
  historial: HistorialCotizacion[];
}

export interface CotizacionProductoPayload {
  idProducto: number;
  cantidad?: number;
  precioUnitario?: number;
  coloresSeleccionados?: string[];
  comentarioCliente?: string;
}

export interface CotizacionPayload {
  usuario: UsuarioCotizacion;
  productos?: CotizacionProductoPayload[];
  comentarios?: ComentarioCotizacion[];
}

export interface CotizacionCarritoItem {
  idProducto: number;
  nombre: string;
  descripcion?: string;
  cantidad: number;
  coloresDisponibles?: CotizacionProductoColor[];
  coloresSeleccionados?: string[];
  comentarioCliente?: string;
}

export interface CotizacionProductoColor {
  idColor: number;
  nombreColor?: string;
  codigoColor?: string;
}
