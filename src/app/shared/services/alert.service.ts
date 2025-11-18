import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor() {}

  success(message: string, title: string = 'Éxito'): Promise<any> {
    return Swal.fire({
      title,
      text: message,
      icon: 'success',
      confirmButtonText: 'Aceptar',
    });
  }

  error(message: string, title: string = 'Error'): Promise<any> {
    return Swal.fire({
      title,
      text: message,
      icon: 'error',
      confirmButtonText: 'Cerrar',
    });
  }

  warning(message: string, title: string = 'Advertencia'): Promise<any> {
    return Swal.fire({
      title,
      text: message,
      icon: 'warning',
      confirmButtonText: 'Entiendo',
    });
  }

  info(message: string, title: string = 'Información'): Promise<any> {
    return Swal.fire({
      title,
      text: message,
      icon: 'info',
      confirmButtonText: 'Ok',
    });
  }

  confirm(
    message: string,
    title: string = '¿Estás seguro?',
    confirmText: string = 'Sí',
    cancelText: string = 'No'
  ): Promise<boolean> {
    return Swal.fire({
      title,
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
    }).then((result) => result.isConfirmed);
  }
}

