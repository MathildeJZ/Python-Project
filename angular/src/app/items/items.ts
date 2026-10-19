
import { Component, signal, computed, OnInit } from '@angular/core';
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
export class ItemsComponent implements OnInit {

  // DATA SIGNALS
  items = signal<any[]>([]);
  newItemName = signal('');
  selectedItems = signal<any[]>([]);
  selectedCategory = signal<string | null>(null);
  searchTerm = signal('');

  // REDIGERING AF HUSKESEDDEL
  editingItemId = signal<number | null>(null);
  editingItemName = signal('');

  // NY LISTE
  showNewCategoryInput = false;
  newCategoryName = '';

  // DASHBOARD
  totalItems = computed(() => this.items().length);

  studyItems = computed(() =>
    this.items().filter(item => item.category === 'Studie').length
  );

  workItems = computed(() =>
    this.items().filter(item => item.category === 'Arbejde').length
  );

  otherItems = computed(() =>
    this.items().filter(
      item => item.category !== 'Studie' &&
              item.category !== 'Arbejde'
    ).length
  );

  // KATEGORIER
  categories = [
    'Indkøb',
    'Arbejde',
    'Studie',
    'Rejse',
    'Rengøring',
    'Børn',
    'Økonomi',
    'Projekter',
    'Personlige mål'
  ];

  constructor(private api: ApiService) {}

  // INITIALISERING
  ngOnInit(): void {
    this.loadItems();
    this.loadCategories();
  }

  // HENT ALLE KATEGORIER
  loadCategories(): void {
    this.api.getCategories().subscribe({
      next: data => {
        this.categories = data.map((category: any) => category.name);
      },
      error: error => {
        console.error('FEJL VED HENTNING AF KATEGORIER:', error);
      }
    });
  }

  // HENT ALLE HUSKESEDLER
  loadItems(): void {
    this.api.getItems().subscribe({
      next: data => {
        this.items.set(data);
      },
      error: error => {
        console.error('FEJL VED HENTNING AF HUSKESEDLER:', error);
      }
    });
  }

  // TILFØJ NY HUSKESEDDEL
  addItem(): void {
    const name = this.newItemName().trim();
    const category = this.selectedCategory();

    if (!name) return;

    if (!category) {
      alert('Vælg en kategori først.');
      return;
    }

    this.api.createItem({ name, category }).subscribe({
      next: () => {
        this.newItemName.set('');
        this.loadItems();
      },
      error: error => {
        console.error('FEJL VED OPRETTELSE:', error);
        alert('Huskesedlen kunne ikke oprettes.');
      }
    });
  }

  // VÆLG ELLER FRAVÆLG HUSKESEDDEL
  toggleItem(item: any): void {
    const current = this.selectedItems();
    const exists = current.some(i => i.id === item.id);

    if (exists) {
      this.selectedItems.set(
        current.filter(i => i.id !== item.id)
      );
    } else {
      this.selectedItems.set([...current, item]);
    }
  }

  // SLET VALGTE HUSKESEDLER
  deleteSelectedItems(): void {
    const itemsToDelete = this.selectedItems();

    if (itemsToDelete.length === 0) return;

    let completed = 0;
    let hasError = false;

    itemsToDelete.forEach(item => {
      this.api.deleteItem(item.id).subscribe({
        next: () => {
          completed++;

          if (completed === itemsToDelete.length && !hasError) {
            this.selectedItems.set([]);
            this.loadItems();
          }
        },
        error: error => {
          hasError = true;
          console.error('FEJL VED SLETNING:', error);
          alert('En eller flere huskesedler kunne ikke slettes.');
        }
      });
    });
  }

  // START REDIGERING AF TEKST
  editItem(item: any): void {
    this.editingItemId.set(item.id);
    this.editingItemName.set(item.name);
  }

  // GEM REDIGERET TEKST
  saveItem(item: any): void {
    const name = this.editingItemName().trim();

    if (!name) {
      alert('Huskesedlen må ikke være tom.');
      return;
    }

    this.api.updateItem(item.id, {
      name: name,
      category: item.category
    }).subscribe({
      next: () => {
        this.editingItemId.set(null);
        this.editingItemName.set('');
        this.loadItems();
      },
      error: error => {
        console.error('FEJL VED OPDATERING:', error);
        alert('Huskesedlen kunne ikke opdateres.');
      }
    });
  }

  // ANNULLER REDIGERING
  cancelEdit(): void {
    this.editingItemId.set(null);
    this.editingItemName.set('');
  }

  // ÆNDRE KATEGORI FOR VALGTE HUSKESEDLER
  changeCategory(): void {
    const itemsToChange = this.selectedItems();

    if (itemsToChange.length === 0) return;

    const newCategory = prompt(
      'Skriv den nye kategori:\n' + this.categories.join(', ')
    );

    if (!newCategory) return;

    const category = this.categories.find(
      c => c.toLowerCase() === newCategory.trim().toLowerCase()
    );

    if (!category) {
      alert('Kategorien findes ikke. Vælg en eksisterende kategori.');
      return;
    }

    let completed = 0;
    let hasError = false;

    itemsToChange.forEach(item => {
      this.api.updateItem(item.id, {
        name: item.name,
        category: category
      }).subscribe({
        next: () => {
          completed++;

          if (completed === itemsToChange.length && !hasError) {
            this.selectedItems.set([]);
            this.loadItems();
            alert('Kategorien er ændret.');
          }
        },
        error: error => {
          hasError = true;
          console.error('FEJL VED ÆNDRING AF KATEGORI:', error);
          alert('Kategorien kunne ikke ændres.');
        }
      });
    });
  }

  // VÆLG KATEGORI
  selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  // ÅBN KATEGORI FRA EN HUSKESEDDEL
  openCategory(category: string): void {
    this.selectedCategory.set(category);
    this.searchTerm.set('');
  }

  // VIS ALLE HUSKESEDLER
  showAllItems(): void {
    this.selectedCategory.set(null);
    this.searchTerm.set('');
  }

  // SLET KATEGORI OG TILHØRENDE HUSKESEDLER
  deleteCategory(categoryName: string): void {
    const confirmed = confirm(
      `Er du sikker på, at du vil slette listen "${categoryName}"?`
    );

    if (!confirmed) return;

    this.api.getCategories().subscribe({
      next: categories => {
        const category = categories.find(
          (c: any) => c.name === categoryName
        );

        if (!category) {
          alert('Listen blev ikke fundet.');
          return;
        }

        this.api.deleteCategory(category.id).subscribe({
          next: () => {
            this.categories = this.categories.filter(
              c => c !== categoryName
            );

            if (this.selectedCategory() === categoryName) {
              this.selectedCategory.set(null);
            }

            this.selectedItems.set(
              this.selectedItems().filter(
                item => item.category !== categoryName
              )
            );

            this.loadItems();
          },
          error: error => {
            console.error('FEJL VED SLETNING AF LISTE:', error);
            alert('Listen kunne ikke slettes.');
          }
        });
      },
      error: error => {
        console.error('FEJL VED HENTNING AF LISTER:', error);
        alert('Listerne kunne ikke hentes.');
      }
    });
  }

  // OPRET NY LISTE
  addCategory(): void {
    const name = this.newCategoryName.trim();

    if (!name) {
      alert('Skriv et navn til listen.');
      return;
    }

    if (this.categories.some(
      category => category.toLowerCase() === name.toLowerCase()
    )) {
      alert('Listen findes allerede.');
      return;
    }

    this.api.createCategory({ name }).subscribe({
      next: () => {
        this.newCategoryName = '';
        this.showNewCategoryInput = false;
        this.loadCategories();
        this.selectedCategory.set(name);
      },
      error: error => {
        if (error.status === 409) {
          alert('En liste med det navn findes allerede.');
        } else {
          console.error('FEJL VED OPRETTELSE AF LISTE:', error);
          alert('Listen kunne ikke oprettes.');
        }
      }
    });
  }

  // FILTRER EFTER SØGETEKST OG KATEGORI
  filteredItems(): any[] {
    const search = this.searchTerm().toLowerCase().trim();
    const category = this.selectedCategory();

    return this.items().filter(item => {
      const name = String(item.name ?? '').toLowerCase();
      const matchesSearch = name.includes(search);

      const matchesCategory = search !== ''
        ? true
        : (!category || item.category === category);

      return matchesSearch && matchesCategory;
    });
  }
}
