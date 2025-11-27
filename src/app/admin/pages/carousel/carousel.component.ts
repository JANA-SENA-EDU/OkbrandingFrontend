import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CarouselConfigService } from '../../../shared/services/carousel-config.service';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
  selector: 'app-carousel-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
})
export class CarouselAdminComponent implements OnInit {
  images: string[] = [];

  constructor(
    private carouselConfig: CarouselConfigService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.images = this.carouselConfig.getImages();
  }

  onFileSelected(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      this.images[index] = result;
    };
    reader.readAsDataURL(file);
  }

  addSlide(): void {
    this.images.push('');
  }

  removeSlide(index: number): void {
    if (this.images.length <= 1) {
      this.alertService.warning('Debe haber al menos una imagen en el carrusel.');
      return;
    }
    this.images.splice(index, 1);
  }

  save(): void {
    this.carouselConfig.setImages(this.images);
    this.alertService.success('Carrusel actualizado', 'Las imágenes se han guardado correctamente.');
  }
}

