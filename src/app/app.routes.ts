import { Routes } from '@angular/router';
import { TradeListComponent } from './trade-list/trade-list.component';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
   
         { path: 'tradeList', loadComponent: ()=> import('./trade-list/trade-list.component').then(m => m.TradeListComponent) },
         { path: '', redirectTo: '/', pathMatch: 'full' },
         { path: 'home', component: AppComponent },
         { path: '**', component: NotFoundComponent } // Wildcard route for 404
     
];


