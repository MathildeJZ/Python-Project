import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ItemsComponent } from './items/items';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ItemsComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {}
