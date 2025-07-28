import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet, RouterLink, ActivatedRoute, Router } from '@angular/router';
import { TradeListComponent } from './trade-list/trade-list.component';
import 'bootstrap/dist/css/bootstrap.min.css';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TradeListComponent, RouterLink, MatIconModule],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TradeWatchlist';

   constructor(private route : Router) {

   }


  openTradeList(trendz: string) {
    this.route.navigate(['/tradeList'], { queryParams: { trendz: trendz } });
  }

  openAllTradeList() {
    this.route.navigate(['/tradeList']);
  }
 
}
 