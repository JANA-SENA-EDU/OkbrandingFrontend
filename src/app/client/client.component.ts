import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css'],
})
export class ClientComponent {}

