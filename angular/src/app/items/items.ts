import { Component, signal } from '@angular/core';
import { ApiService } from '../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { computed} from '@angular/core';

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
  totalItems = computed(() => this.items(). length);
  searchTerm = signal('');

  studyItems = computed(() =>
    this.items().filter(item => item.category === 'Studie').length);

  workItems = computed(() =>
    this.items().filter(item => item.category === 'Arbejde').length);

  otherItems = computed(() =>
    this.items().filter(
      item => item.category !== 'Studie' && item.category !== 'Arbejde'
    ).length);
  


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

  // HENT ALLE ITEMS FRA BACKEND
  loadItems() {
    this.api.getItems().subscribe(data => {
      this.items.set(data);
    });
  }

  // TILFØJ ITEM MED KATEGORI
  addItem() {
    const name = this.newItemName().trim();
    const category = this.selectedCategory();

    console.log('NAVN:', name);
    console.log('KATEGORI:', category);

    if (!name) return;

    if (!category) {
      alert('Vælg en kategori først.');
      return;
    }

    this.api.createItem({ name, category }).subscribe({
      next: (response) => {
        console.log('API SVAR:', response);

        this.newItemName.set('');
        this.loadItems();
      },
      error: (error) => {
        console.error('API FEJL:', error);
      }
    });
  }
    
  // MULTI-SELECT
  toggleItem(item: any) {
    const current = this.selectedItems();
    const exists = current.some(i => i.id === item.id);

    if (exists) {
      this.selectedItems.set(current.filter(i => i.id !== item.id));
    } else {
      this.selectedItems.set([...current, item]);
    }
  }

  // SLET VALGTE ITEMS
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

  // VÆLG KATEGORI
  selectCategory(category: string) {
    this.selectedCategory.set(category);
  }
  
  openCategory(category: string) {
    this.selectedCategory.set(category);
    this.searchTerm.set('');
  } 

  // FILTRER ITEMS EFTER KATEGORI
    filteredItems(): any[] {

      const search = this.searchTerm().toLowerCase().trim();

      // Hvis der søges, søges der i ALLE kategorier
      if (search) {
        return this.items().filter(item =>
          item.name.toLowerCase().includes(search)
        );
      }

      // Hvis der ikke søges, vises kun den valgte kategori
      const category = this.selectedCategory();

      if (!category) {
        return [];
      }

      return this.items().filter(
        item => item.category === category
      );
      
  }
}

