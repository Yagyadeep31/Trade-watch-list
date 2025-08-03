import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet, RouterLink, ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TradeListComponent } from './trade-list/trade-list.component';
import { NavbarComponent } from './navbar/navbar.component';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { WATCHLISTS, Watchlist } from './watchlists';
import { saveWatchlists, loadWatchlists } from './local-storage';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RenameWatchlistDialogComponent } from './rename-watchlist-dialog.component';
import { ConfirmDeleteDialogComponent } from './confirm-delete-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TradeListComponent, RouterLink, MatIconModule, NavbarComponent, MatSnackBarModule, MatDialogModule, RenameWatchlistDialogComponent, ConfirmDeleteDialogComponent, FormsModule],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TradeWatchlist';
  watchlists: Watchlist[] = [];
  selectedWatchlistIndex: number = 0;

  constructor(private route: Router, private snackBar: MatSnackBar, private dialog: MatDialog) {
    const stored = loadWatchlists();
    this.watchlists = stored && Array.isArray(stored) ? stored : WATCHLISTS;
    // Save initial state if nothing in storage
    if (!stored) saveWatchlists(this.watchlists);
  }

  selectWatchlist(index: number) {
    this.selectedWatchlistIndex = index;
    this.route.navigate(['/tradeList'], { queryParams: { watchlist: index } });
  }

  addWatchlist() {
    const newName = `WatchList ${this.watchlists.length + 1}`;
    this.watchlists.push({
      name: newName,
      description: 'New Watchlist',
      trades: []
    });
    this.selectedWatchlistIndex = this.watchlists.length - 1;
    saveWatchlists(this.watchlists);
    this.snackBar.open('Watchlist added', 'Close', { duration: 2000 });
  }

  async editWatchlist(index: number, event: Event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(RenameWatchlistDialogComponent, {
      data: { name: this.watchlists[index].name }
    });
    const newName = await dialogRef.afterClosed().toPromise();
    if (newName && newName.trim()) {
      this.watchlists[index].name = newName.trim();
      saveWatchlists(this.watchlists);
      this.snackBar.open('Watchlist renamed', 'Close', { duration: 2000 });
    }
  }

  async deleteWatchlist(index: number, event: Event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);
    const confirmed = await dialogRef.afterClosed().toPromise();
    if (confirmed) {
      this.watchlists.splice(index, 1);
      if (this.selectedWatchlistIndex >= this.watchlists.length) {
        this.selectedWatchlistIndex = this.watchlists.length - 1;
      }
      saveWatchlists(this.watchlists);
      this.snackBar.open('Watchlist deleted', 'Close', { duration: 2000 });
      this.route.navigate(['/tradeList'], { queryParams: { watchlist: this.selectedWatchlistIndex } });
    }
  }

  openTradeList(trendz: string) {
    this.route.navigate(['/tradeList'], { queryParams: { trendz: trendz } });
  }

  openAllTradeList() {
    this.route.navigate(['/tradeList']);
  }

  saveWatchlists() {
    saveWatchlists(this.watchlists);
  }
}