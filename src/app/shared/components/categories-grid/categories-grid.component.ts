import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { Categoria } from '../../../admin/models/categoria.model';

@Component({
  selector: 'app-categories-grid',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule],
  templateUrl: './categories-grid.component.html',
  styleUrl: './categories-grid.component.css',
})
export class CategoriesGridComponent {
  @Input() categorias: Categoria[] = [];
}

