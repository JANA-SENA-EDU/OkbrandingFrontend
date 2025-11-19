import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ClientNavbarComponent } from './components/client-navbar/client-navbar.component'; 

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ClientNavbarComponent],
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css'],
})
export class ClientComponent {}

