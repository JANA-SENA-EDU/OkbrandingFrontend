import { Component } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { UsuarioFormComponent } from './usuario-form/usuario-form.component';
import { AlertService } from '../../../shared/services/alert.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [MatIconModule,MatTableModule, CommonModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {
  usuarios: any[] = [];

  displayedColumns: string[] = ['nombre', 'correo', 'telefono', 'nombreUsuario', 'activo', 'acciones'];

  constructor(
    private usuarioService: UsuarioService,
    public dialog: MatDialog,
    public alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios(): void {
    this.usuarioService.listarUsuarios().subscribe({
      next: (usuarios) => this.usuarios = usuarios
    });
  }

  abrirFormulario(usuario: any = null): void {
    const dialogRef = this.dialog.open(UsuarioFormComponent, {
      width: '400px',
      data: usuario
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.obtenerUsuarios();
    });
  }

  eliminarUsuario(idUsuario: number | undefined): void {
    if (!idUsuario) {
       this.alertService.warning('ID de usuario no válido', 'Advertencia');
       return;
    }
 
    this.alertService.confirm(
       'Esta acción desactivará el usuario',
       '¿Estás seguro?',
       'Sí, desactivar',
       'Cancelar'
    ).then((confirmado: boolean) => {
       if (confirmado) {
          this.usuarioService.eliminarUsuario(idUsuario).subscribe(
             () => {
                this.alertService.success('El usuario ha sido desactivado con éxito');
                this.obtenerUsuarios();
             },
             () => {
                this.alertService.error('No se pudo desactivar el usuario');
             }
          );
       }
    });
 }

 getEstadoClase(activo: any): string {
  return activo == 1 || activo === true ? 'activo' : 'inactivo';
}
 
  
  
}
