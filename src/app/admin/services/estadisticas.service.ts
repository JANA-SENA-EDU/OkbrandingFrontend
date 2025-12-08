import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {

  private baseUrl = environment.apiUrl + '/okBranding/estadisticas';

  constructor(private http: HttpClient) {}

  getResumen(): Observable<any> {
    return this.http.get(`${this.baseUrl}/resumen`);
  }

  getCotizacionesPorMes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/cotizaciones-por-mes`);
  }

  getProductosPorCategoria(): Observable<any> {
    return this.http.get(`${this.baseUrl}/productos-por-categoria`);
  }

  getProductosPorEstado(): Observable<any> {
    return this.http.get(`${this.baseUrl}/productos-por-estado`);
  }

  descargarPDF(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/reporte-productos-pro`, {
      responseType: 'blob'
    });
  }
}
