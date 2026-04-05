import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'cliente',
    loadComponent: () => import('./cliente/cliente.page').then( m => m.ClientePage)
  },
];
