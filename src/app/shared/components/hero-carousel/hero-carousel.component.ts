import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-hero-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-carousel.component.html',
  styleUrl: './hero-carousel.component.css',
})
export class HeroCarouselComponent implements OnInit, OnDestroy {
  images: string[] = [
    'assets/img/banner1.png',
    'assets/img/banner2.png',
    'assets/img/banner3.png',
  ];

  currentIndex = 0;
  private intervalId: number | undefined;

  ngOnInit(): void {
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

