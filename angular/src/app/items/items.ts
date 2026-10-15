
import { Component, signal, computed } from '@angular/core';
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
    searchTerm = signal('');

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

  loadCategories() {
    this.api.getCategories().subscribe({
      next: data => {
        this.categories = data.map(category => category.name);
      },
      error: error => {
        console.error('FEJL VED HENTNING AF KATEGORIER:', error);
      }
    });
  }

      
    deleteCategory(categoryName: string) {
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


  ngOnInit() {
    this.loadItems();
    this.loadCategories();
  }

  // HENT ALLE HUSKESEDLER FRA BACKEND
  loadItems() {
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
  addItem() {
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
      }
    });
  }

  // VÆLG ELLER FRAVÆLG HUSKESEDDEL
  toggleItem(item: any) {
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
  deleteSelectedItems() {
    const itemsToDelete = this.selectedItems();

    if (itemsToDelete.length === 0) return;

    let deletedCount = 0;
    let hasError = false;

    itemsToDelete.forEach(item => {
      this.api.deleteItem(item.id).subscribe({
        next: () => {
          deletedCount++;

          if (deletedCount + (itemsToDelete.length - deletedCount) === itemsToDelete.length &&
              deletedCount === itemsToDelete.length && !hasError) {
            this.selectedItems.set([]);
            this.loadItems();
          }
        },
        error: error => {
          hasError = true;
          console.error('FEJL VED SLETNING:', error);
        }
      });
    });
  }

  // VÆLG KATEGORI
  selectCategory(category: string) {
    this.selectedCategory.set(category);
  }

  // ÅBN KATEGORI FRA EN HUSKESEDDEL
  openCategory(category: string) {
    this.selectedCategory.set(category);
    this.searchTerm.set('');
  }

  // VIS ALLE HUSKESEDLER
  showAllItems() {
    this.selectedCategory.set(null);
    this.searchTerm.set('');
  }

  
  // OPRET NY LISTE
  addCategory() {
    const name = this.newCategoryName.trim();

    if (!name) {
      alert('Skriv et navn til listen.');
      return;
    }

    if (this.categories.includes(name)) {
      alert('Listen findes allerede.');
      return;
    }

    this.api.createCategory({ name }).subscribe({
      next: () => {
        this.categories.push(name);
        this.selectedCategory.set(name);
        this.newCategoryName = '';
        this.showNewCategoryInput = false;
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

        // Søgeteksten skal matche
        const matchesSearch = name.includes(search);

        // Hvis der søges, søges i alle kategorier
        // Hvis der ikke søges, bruges den valgte kategori
        const matchesCategory = search !== ''
          ? true
          : (!category || item.category === category);

        return matchesSearch && matchesCategory;
      });
    }

}

