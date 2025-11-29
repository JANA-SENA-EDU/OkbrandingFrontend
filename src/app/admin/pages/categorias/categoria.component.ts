import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../models/categoria.model';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CategoriaFormComponent } from './categoria-form/categoria-form.component';
import { AlertService } from '../../../shared/services/alert.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,
  ],
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css'],
})
export class CategoriaComponent implements OnInit {
  displayedColumns: string[] = [
    'idCategoria',
    'nombreCategoria',
    'descripcion',
    'imagen',
    'acciones',
  ];
  categorias: Categoria[] = [];
  terminoBusqueda = '';

  constructor(
    private categoriaService: CategoriaService,
    private dialog: MatDialog,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.listarCategorias();
  }

  listarCategorias(): void {
    this.categoriaService.listar().subscribe((data) => (this.categorias = data));
  }

  get categoriasFiltradas(): Categoria[] {
    return this.categorias
      .filter((categoria) => {
        if (!this.terminoBusqueda.trim()) {
          return true;
        }
        const termino = this.terminoBusqueda.toLowerCase();
        return (
          categoria.nombreCategoria?.toLowerCase().includes(termino) ||
          categoria.descripcion?.toLowerCase().includes(termino)
        );
      });
  }

  limpiarFiltros(): void {
    this.terminoBusqueda = '';
  }

  abrirFormulario(categoria: Categoria | null = null): void {
    const dialogRef = this.dialog.open(CategoriaFormComponent, {
      width: '420px',
      data: categoria,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.idCategoria) {
          this.categoriaService.actualizar(result).subscribe(() => this.listarCategorias());
        } else {
          this.categoriaService.guardar(result).subscribe(() => this.listarCategorias());
        }
      }
    });
  }

  eliminarCategoria(id: number): void {
    this.alertService
      .confirm(
        '¿Estás seguro de eliminar esta categoría?',
        'Esta acción no se puede deshacer.',
        'Sí, eliminar',
        'Cancelar'
      )
      .then((confirmado: boolean) => {
        if (confirmado) {
          this.categoriaService.eliminar(id).subscribe({
            next: () => {
              this.alertService.success('Categoría eliminada correctamente');
              this.listarCategorias();
            },
            error: (err) => {
              if (err.status === 409) {
                this.alertService.warning(
                  'No se puede eliminar la categoría porque está asociada a uno o más productos.'
                );
              } else if (err.status === 404) {
                this.alertService.error('La categoría no existe.');
              } else {
                this.alertService.error('Error al eliminar la categoría.');
              }
            },
          });
        }
      });
  }
}
