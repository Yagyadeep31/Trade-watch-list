import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { TradeListComponent } from './trade-list/trade-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TradeListComponent, RouterLink],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TradeWatchlist';
 
}
 