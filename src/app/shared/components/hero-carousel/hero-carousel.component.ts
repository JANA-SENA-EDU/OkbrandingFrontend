import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CarouselConfigService } from '../../services/carousel-config.service';

@Component({
  selector: 'app-hero-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-carousel.component.html',
  styleUrl: './hero-carousel.component.css',
})
export class HeroCarouselComponent implements OnInit, OnDestroy {
  images: string[] = [];

  currentIndex = 0;
  private intervalId: number | undefined;

  constructor(private carouselConfig: CarouselConfigService) {}

  ngOnInit(): void {
    this.images = this.carouselConfig.getImages();
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }
  }

  getTransform(): string {
    return `translateX(-${this.currentIndex * 100}%)`;
  }

  next(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prev(): void {
    this.currentIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  private startAutoSlide(): void {
    this.intervalId = window.setInterval(() => this.next(), 5000);
  }
}
