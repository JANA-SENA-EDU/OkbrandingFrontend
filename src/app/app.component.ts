import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoaderComponent } from './shared/components/loader/loader.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'frontend-okbranding';

  constructor(private router: Router) {
    console.log('Config de rutas:', this.router.config);
  }
}

