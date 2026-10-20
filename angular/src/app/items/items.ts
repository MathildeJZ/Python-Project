
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

  // DATA
  items = signal<any[]>([]);
  newItemName = signal('');
  selectedItems = signal<any[]>([]);
  selectedCategory = signal<string | null>(null);
  searchTerm = signal('');

  // REDIGERING AF HUSKESEDLER
  editingItemId = signal<number | null>(null);
  editingItemName = signal('');

  // OPRET NY LISTE
  showNewCategoryInput = false;
  newCategoryName = '';

  // KATEGORIER
  categories: string[] = [];

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

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadItems();
    this.loadCategories();
  }

  // HENT LISTER
  loadCategories(): void {
    this.api.getCategories().subscribe({
      next: data => {
        this.categories = data.map((category: any) => category.name);
      },
      error: error => {
        console.error('Fejl ved hentning af lister:', error);
      }
    });
  }

  // HENT HUSKESEDLER
  loadItems(): void {
    this.api.getItems().subscribe({
      next: data => this.items.set(data),
      error: error => {
        console.error('Fejl ved hentning af huskesedler:', error);
      }
    });
  }

  // OPRET HUSKESEDDEL
  addItem(): void {
    const name = this.newItemName().trim();
    const category = this.selectedCategory();

    if (!name) return;

    if (!category) {
      alert('Vælg en liste først.');
      return;
    }

    this.api.createItem({ name, category }).subscribe({
      next: () => {
        this.newItemName.set('');
        this.loadItems();
      },
      error: error => {
        console.error(error);
        alert('Huskesedlen kunne ikke oprettes.');
      }
    });
  }

  // VÆLG HUSKESEDDEL
  toggleItem(item: any): void {
    const selected = this.selectedItems();
    const exists = selected.some(i => i.id === item.id);

    this.selectedItems.set(
      exists
        ? selected.filter(i => i.id !== item.id)
        : [...selected, item]
    );
  }

  // SLET VALGTE HUSKESEDLER
  deleteSelectedItems(): void {
    const selected = this.selectedItems();

    if (selected.length === 0) {
      alert('Vælg mindst én huskeseddel.');
      return;
    }

    if (!confirm(`Vil du slette ${selected.length} huskeseddel(er)?`)) {
      return;
    }

    let completed = 0;
    let failed = false;

    selected.forEach(item => {
      this.api.deleteItem(item.id).subscribe({
        next: () => {
          completed++;
          finish();
        },
        error: error => {
          console.error(error);
          failed = true;
          completed++;
          finish();
        }
      });
    });

    const finish = (): void => {
      if (completed !== selected.length) return;

      this.selectedItems.set([]);
      this.loadItems();

      if (failed) {
        alert('En eller flere huskesedler kunne ikke slettes.');
      }
    };
  }

  // START REDIGERING AF HUSKESEDDEL
  editItem(item: any): void {
    this.editingItemId.set(item.id);
    this.editingItemName.set(item.name);
  }

  // GEM REDIGERET HUSKESEDDEL
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
        this.items.update(items=> items.map(current => current.id === item.id ? { ...current, name } : current));
        this.cancelEdit();
      },
      error: error => {
        console.error('Fejl ved opdatering af huskeseddel:', error);
        alert('Huskesedlen kunne ikke opdateres.');
      }
    });
  }

  // ANNULLER REDIGERING
  cancelEdit(): void {
    this.editingItemId.set(null);
    this.editingItemName.set('');
  }

  // FLYT VALGTE HUSKESEDLER TIL EN ANDEN LISTE
  changeCategory(): void {
    const selected = this.selectedItems();

    if (selected.length === 0) {
      alert('Vælg mindst én huskeseddel først.');
      return;
    }

    const input = prompt(
      'Skriv navnet på den eksisterende liste:\n' +
      this.categories.join(', ')
    );

    if (input === null) return;

    const category = input.trim();

    if (!this.categories.includes(category)) {
      alert('Listen findes ikke. Vælg en eksisterende liste.');
      return;
    }

    let completed = 0;
    let failed = false;

    const finish = (): void => {
      if (completed !== selected.length) return;

      this.selectedItems.set([]);
      this.loadItems();

      alert(
        failed
          ? 'En eller flere huskesedler kunne ikke flyttes.'
          : 'Huskesedlerne er flyttet.'
      );
    };

    selected.forEach(item => {
      this.api.updateItem(item.id, {
        name: item.name,
        category
      }).subscribe({
        next: () => {
          completed++;
          finish();
        },
        error: error => {
          console.error(error);
          failed = true;
          completed++;
          finish();
        }
      });
    });
  }

  // VÆLG LISTE
  selectCategory(category: string): void {
    this.selectedCategory.set(category);
    this.searchTerm.set('');
  }

  openCategory(category: string): void {
    this.selectCategory(category);
  }

  showAllItems(): void {
    this.selectedCategory.set(null);
    this.searchTerm.set('');
  }

  // OPRET LISTE
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
        console.error(error);
        alert(
          error.status === 409
            ? 'Listen findes allerede.'
            : 'Listen kunne ikke oprettes.'
        );
      }
    });
  }

  // OMDØB LISTE
  renameCategory(oldName: string): void {
    const input = prompt('Skriv listens nye navn:', oldName);

    if (input === null) return;

    const newName = input.trim();

    if (!newName) {
      alert('Listen skal have et navn.');
      return;
    }

    if (newName.toLowerCase() === oldName.toLowerCase()) {
      return;
    }

    if (this.categories.some(
      category => category.toLowerCase() === newName.toLowerCase()
    )) {
      alert('En liste med det navn findes allerede.');
      return;
    }

    this.api.getCategories().subscribe({
      next: categories => {
        const current = categories.find(
          (category: any) => category.name === oldName
        );

        if (!current) {
          alert('Listen blev ikke fundet.');
          return;
        }

        this.api.updateCategory(current.id, { name: newName }).subscribe({
          next: () => {
            if (this.selectedCategory() === oldName) {
              this.selectedCategory.set(newName);
            }

            this.categories = this.categories.map(category =>
              category === oldName ? newName : category
            );

            this.loadItems();
          },
          error: error => {
            console.error(error);
            alert('Listen kunne ikke omdøbes.');
          }
        });
      },
      error: error => {
        console.error(error);
        alert('Listerne kunne ikke hentes.');
      }
    });
  }

  // SLET LISTE
  deleteCategory(categoryName: string): void {
    if (!confirm(
      `Vil du slette listen "${categoryName}" og dens huskesedler?`
    )) {
      return;
    }

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
              name => name !== categoryName
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
            console.error(error);
            alert('Listen kunne ikke slettes.');
          }
        });
      },
      error: error => {
        console.error(error);
        alert('Listerne kunne ikke hentes.');
      }
    });
  }

  // SØGNING OG FILTRERING
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
