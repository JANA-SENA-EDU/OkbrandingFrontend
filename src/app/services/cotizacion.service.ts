import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {
  Cotizacion,
  CotizacionCarritoItem,
  CotizacionPayload,
} from './models/cotizacion.model';

@Injectable({
  providedIn: 'root',
})
export class CotizacionService {
  private readonly cartStorageKey = 'okbranding_cart';
  private itemsSubject = new BehaviorSubject<CotizacionCarritoItem[]>(
    this.obtenerCarritoInicial()
  );
  readonly items$ = this.itemsSubject.asObservable();

  private apiUrl = `https://okbranding-ava4htfqc2ajefhh.chilecentral-01.azurewebsites.net/okBranding/cotizaciones`;

  constructor(private http: HttpClient) {
    this.items$.subscribe((items) =>
      sessionStorage.setItem(this.cartStorageKey, JSON.stringify(items))
    );
  }

  private obtenerCarritoInicial(): CotizacionCarritoItem[] {
    try {
      const raw = sessionStorage.getItem(this.cartStorageKey);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw) as CotizacionCarritoItem[];
      return parsed.map((item) => ({
        ...item,
        coloresSeleccionados: item.coloresSeleccionados || [],
      }));
    } catch {
      return [];
    }
  }

  agregarProducto(producto: any, cantidad = 1): void {
    if (!producto?.idProducto) {
      return;
    }
    const items = [...this.itemsSubject.value];
    const coloresDisponibles = Array.isArray(producto?.colores)
      ? producto.colores.map((color: any) => ({
          idColor: color.idColor,
          nombreColor: color.nombreColor,
          codigoColor: color.codigoColor,
        }))
      : [];
    const index = items.findIndex(
      (item) => item.idProducto === producto.idProducto
    );
    if (index >= 0) {
      items[index] = {
        ...items[index],
        cantidad: items[index].cantidad + cantidad,
      };
    } else {
      items.push({
        idProducto: producto.idProducto,
        nombre: producto.nombre || producto.name || 'Producto',
        descripcion: producto.descripcion,
        cantidad,
        coloresDisponibles,
        coloresSeleccionados: [],
      });
    }
    this.itemsSubject.next(items);
  }

  actualizarCantidad(idProducto: number, cantidad: number): void {
    const items = this.itemsSubject.value
      .map((item) =>
        item.idProducto === idProducto ? { ...item, cantidad } : item
      )
      .filter((item) => item.cantidad > 0);
    this.itemsSubject.next(items);
  }

  eliminarProducto(idProducto: number): void {
    const filtrados = this.itemsSubject.value.filter(
      (item) => item.idProducto !== idProducto
    );
    this.itemsSubject.next(filtrados);
  }

  actualizarDetalleProducto(
    idProducto: number,
    cambios: Partial<
      Pick<CotizacionCarritoItem, 'coloresSeleccionados' | 'comentarioCliente'>
    >
  ): void {
    const items = this.itemsSubject.value.map((item) =>
      item.idProducto === idProducto ? { ...item, ...cambios } : item
    );
    this.itemsSubject.next(items);
  }

  limpiar(): void {
    this.itemsSubject.next([]);
    sessionStorage.removeItem(this.cartStorageKey);
  }

  get cantidad(): number {
    return this.itemsSubject.value.reduce(
      (acc, item) => acc + (item.cantidad || 0),
      0
    );
  }

  get items(): CotizacionCarritoItem[] {
    return this.itemsSubject.value;
  }

  crearCotizacion(cotizacion: CotizacionPayload): Observable<Cotizacion> {
    return this.http.post<Cotizacion>(this.apiUrl, cotizacion);
  }

  listarCotizaciones(): Observable<Cotizacion[]> {
    return this.http.get<Cotizacion[]>(this.apiUrl);
  }

  obtenerCotizacion(id: number): Observable<Cotizacion> {
    return this.http.get<Cotizacion>(`${this.apiUrl}/${id}`);
  }

  responderCotizacion(
    id: number,
    respuesta: CotizacionPayload
  ): Observable<Cotizacion> {
    return this.http.put<Cotizacion>(`${this.apiUrl}/${id}/respuesta`, respuesta);
  }

  ajustarCotizacionCliente(
    id: number,
    ajustes: CotizacionPayload
  ): Observable<Cotizacion> {
    return this.http.put<Cotizacion>(
      `${this.apiUrl}/${id}/ajustes-cliente`,
      ajustes
    );
  }

  aceptarCotizacion(
    id: number,
    datos: CotizacionPayload
  ): Observable<Cotizacion> {
    return this.http.put<Cotizacion>(
      `${this.apiUrl}/${id}/aceptacion-cliente`,
      datos
    );
  }

  cancelarCotizacion(
    id: number,
    datos: CotizacionPayload
  ): Observable<Cotizacion> {
    return this.http.put<Cotizacion>(
      `${this.apiUrl}/${id}/cancelacion-cliente`,
      datos
    );
  }
}
