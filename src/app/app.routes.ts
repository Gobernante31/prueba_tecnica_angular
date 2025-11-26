import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'entidades',
    loadComponent: () =>
      import('./entidades/entidades.component').then(
        (m) => m.EntidadesComponent
      ),
  },
  {
    path: 'contactos',
    loadComponent: () =>
      import('./contactos/contactos.component').then(
        (m) => m.ContactosComponent
      ),
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
