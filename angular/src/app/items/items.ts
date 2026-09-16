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

  // DATA SIGNALS
  items = signal<any[]>([]);
  newItemName = signal('');
  selectedItems = signal<any[]>([]);
  selectedCategory = signal<string | null>(null);

  // KATEGORIER
  categories = [
    "Indkøb",
    "Arbejde",
    "Studie",
    "Rejse",
    "Rengøring",
    "Børn",
    "Økonomi",
    "Projekter",
    "Personlige mål",
  ];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadItems();
  }

  // LOAD ITEMS
  loadItems() {
    this.api.getItems().subscribe(data => {
      this.items.set(data);
    });
  }

  // ADD ITEM
  addItem() {
    const name = this.newItemName().trim();
    if (!name) return;

    this.api.createItem(name).subscribe(() => {
      this.newItemName.set('');
      this.loadItems();
    });
  }

  // MULTI-SELECT TOGGLE
  toggleItem(item: any) {
    const current = this.selectedItems();
    const exists = current.some(i => i.id === item.id);

    if (exists) {
      this.selectedItems.set(current.filter(i => i.id !== item.id));
    } else {
      this.selectedItems.set([...current, item]);
    }
  }

  // DELETE SELECTED ITEMS
  deleteSelectedItems() {
    const items = this.selectedItems();
    if (items.length === 0) return;

    items.forEach((item, index) => {
      this.api.deleteItem(item.id).subscribe(() => {
        if (index === items.length - 1) {
          this.selectedItems.set([]);
          this.loadItems();
        }
      });
    });
  }

  // SELECT CATEGORY
  selectCategory(category: string) {
    this.selectedCategory.set(category);
  }
}
