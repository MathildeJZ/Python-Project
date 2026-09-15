import { Component, signal } from '@angular/core';
import { ApiService } from '../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './items.html',
  styleUrls: ['./items.css']
})
export class ItemsComponent {

  items = signal<any[]>([]);
  newItemName = signal('');

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.api.getItems().subscribe(data => {
      this.items.set(data);
    });
  }

  addItem() {
    const name = this.newItemName().trim();
    if (!name) return;

    this.api.createItem(name).subscribe(() => {
      this.newItemName.set('');
      this.loadItems();
    });
  }
}
