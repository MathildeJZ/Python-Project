import { Component } from '@angular/core';
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

  items: any[] = [];
  newItemName = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.api.getItems().subscribe(data => {
      this.items = data;
    });
  }

  addItem() {
    this.api.createItem(this.newItemName).subscribe(() => {
      this.newItemName = '';
      this.loadItems();
    });
  }
}

