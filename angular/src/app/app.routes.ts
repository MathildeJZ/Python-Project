    import { Routes } from '@angular/router';

    export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
        import('./items/items').then((m) => m.ItemsComponent),
    }
    ];
