import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { UsuarioFormComponent } from './usuario-form/usuario-form.component';
import { AlertService } from '../../../shared/services/alert.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    MatIconModule,
    MatTableModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css',
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  terminoBusqueda = '';
  filtroEstado: 'todos' | 'activos' | 'inactivos' = 'todos';
  filtroRol = 'todos';

  displayedColumns: string[] = [
    'nombre',
    'correo',
    'telefono',
    'nombreUsuario',
    'rol',
    'activo',
    'acciones',
  ];

  constructor(
    private usuarioService: UsuarioService,
    public dialog: MatDialog,
    public alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  get usuariosFiltrados(): any[] {
    return this.usuarios
      .filter((usuario) => {
        if (this.filtroEstado === 'activos') {
          return usuario.activo === 1 || usuario.activo === true;
        }
        if (this.filtroEstado === 'inactivos') {
          return !(usuario.activo === 1 || usuario.activo === true);
        }
        return true;
      })
      .filter((usuario) => {
        if (this.filtroRol === 'todos') {
          return true;
        }
        return usuario.rol?.nombre === this.filtroRol;
      })
      .filter((usuario) => {
        if (!this.terminoBusqueda.trim()) {
          return true;
        }
        const termino = this.terminoBusqueda.toLowerCase();
        return (
          usuario.nombre?.toLowerCase().includes(termino) ||
          usuario.correo?.toLowerCase().includes(termino) ||
          usuario.nombreUsuario?.toLowerCase().includes(termino)
        );
      });
  }

  obtenerUsuarios(): void {
    this.usuarioService.listarUsuarios().subscribe({
      next: (usuarios) => (this.usuarios = usuarios),
    });
  }

  abrirFormulario(usuario: any = null): void {
    const dialogRef = this.dialog.open(UsuarioFormComponent, {
      width: '420px',
      data: usuario,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.obtenerUsuarios();
    });
  }

  eliminarUsuario(idUsuario: number | undefined): void {
    if (!idUsuario) {
      this.alertService.warning('ID de usuario no es válido', 'Advertencia');
      return;
    }

    this.alertService
      .confirm(
        'Esta acción desactivará el usuario',
        '¿Estás seguro?',
        'Sí, desactivar',
        'Cancelar'
      )
      .then((confirmado: boolean) => {
        if (confirmado) {
          this.usuarioService.eliminarUsuario(idUsuario).subscribe({
            next: () => this.obtenerUsuarios(),
            error: () => {
              this.alertService.error('No se pudo desactivar el usuario');
            },
          });
        }
      });
  }

  getEstadoClase(activo: any): string {
    return activo == 1 || activo === true ? 'activo' : 'inactivo';
  }

  limpiarFiltros(): void {
    this.terminoBusqueda = '';
    this.filtroEstado = 'todos';
    this.filtroRol = 'todos';
  }

  get rolesDisponibles(): string[] {
    const roles = this.usuarios
      .map((usuario) => usuario.rol?.nombre)
      .filter((rol: string | undefined) => !!rol);
    return Array.from(new Set(roles as string[]));
  }
}
