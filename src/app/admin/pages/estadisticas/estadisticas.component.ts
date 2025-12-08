import { Component, OnInit } from '@angular/core';
import { EstadisticasService } from '../../services/estadisticas.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {

  resumen: any = {};
  chart1!: Chart;
  chart2!: Chart;
  chart3!: Chart;

  constructor(private estadisticasService: EstadisticasService) {}

  ngOnInit(): void {
    this.cargarResumen();
    this.cargarCotizacionesMes();
    this.cargarProductosPorCategoria();
    this.cargarProductosPorEstado();
  }

  // =========================================
  // RESUMEN
  // =========================================
  cargarResumen(): void {
    this.estadisticasService.getResumen().subscribe(data => {
      this.resumen = data;
    });
  }

  // =========================================
  // COTIZACIONES POR MES (LINE)
  // =========================================
  cargarCotizacionesMes(): void {
    this.estadisticasService.getCotizacionesPorMes().subscribe(data => {

      if (this.chart1) {
        this.chart1.destroy();
      }

      this.chart1 = new Chart('cotizacionesMes', {
        type: 'line',
        data: {
          labels: data.map((d: any) => d.mes),
          datasets: [{
            label: 'Cotizaciones por mes',
            data: data.map((d: any) => d.cantidad),
            borderColor: '#FF6F00',
            backgroundColor: 'rgba(255, 111, 0, 0.25)',
            borderWidth: 2,
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false }
          }
        }
      });
    });
  }

  // =========================================
  // PRODUCTOS POR CATEGORÍA (BAR)
  // =========================================
  cargarProductosPorCategoria(): void {
    this.estadisticasService.getProductosPorCategoria().subscribe(data => {

      if (this.chart2) {
        this.chart2.destroy();
      }

      this.chart2 = new Chart('productosCategoria', {
        type: 'bar',
        data: {
          labels: data.map((d: any) => d.categoria),
          datasets: [{
            //label: 'Productos por categoría',//
            data: data.map((d: any) => d.cantidad),
            backgroundColor: '#FFC107',
            borderColor: '#FF6F00',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: false }
          },
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    });
  }

  // =========================================
  // PRODUCTOS POR ESTADO (PIE)
  // =========================================
  cargarProductosPorEstado(): void {
    this.estadisticasService.getProductosPorEstado().subscribe(data => {

      if (this.chart3) {
        this.chart3.destroy();
      }

      this.chart3 = new Chart('productosEstado', {
        type: 'pie',
        data: {
          labels: data.map((d: any) => d.estado),
          datasets: [{
            label: 'Productos por estado',
            data: data.map((d: any) => d.cantidad),
            backgroundColor: [
              '#FF6F00',
              '#FFC107',
              '#FF8F00',
              '#FFA726',
              '#FFB74D'
            ]
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    });
  }

  // =========================================
  // DESCARGAR PDF
  // =========================================
  descargarPDF(): void {
    this.estadisticasService.descargarPDF().subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = 'reporte_productos_okbranding.pdf';
      link.click();

      URL.revokeObjectURL(url);
    });
  }
}
