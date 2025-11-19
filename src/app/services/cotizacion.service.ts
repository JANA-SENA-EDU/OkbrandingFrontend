import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CotizacionService {
  private itemsSubject = new BehaviorSubject<any[]>([]);
  readonly items$ = this.itemsSubject.asObservable();

  agregarProducto(producto: any): void {
    const actual = this.itemsSubject.value;
    this.itemsSubject.next([...actual, producto]);
  }

  limpiar(): void {
    this.itemsSubject.next([]);
  }

  get cantidad(): number {
    return this.itemsSubject.value.length;
  }

  get items(): any[] {
    return this.itemsSubject.value;
  }
}

