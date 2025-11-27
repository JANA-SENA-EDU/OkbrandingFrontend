import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CarouselConfigService {
  private readonly storageKey = 'hero_carousel_images';

  private readonly defaultImages: string[] = [
    'assets/img/banner1.png',
    'assets/img/banner2.png',
    'assets/img/banner3.png',
  ];

  getImages(): string[] {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return [...this.defaultImages];
    }

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // Si falla el parseo, volvemos a los valores por defecto
    }

    return [...this.defaultImages];
  }

  setImages(images: string[]): void {
    const cleaned = images.filter((src) => !!src);
    const valueToStore = cleaned.length > 0 ? cleaned : this.defaultImages;
    localStorage.setItem(this.storageKey, JSON.stringify(valueToStore));
  }
}

