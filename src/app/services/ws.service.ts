import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { loadWatchlists, saveWatchlists } from '../local-storage';
import { SymbolPriceService } from './symbol-price.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private messagesSubject = new Subject<any>();
  public messages = this.messagesSubject.asObservable();
  private intervalId: any;
  private watchlists: any[] = [];
  private watchlistStreams: { [key: number]: any[] } = {};

  constructor(private symbolPriceService: SymbolPriceService) {
    this.watchlists = loadWatchlists() || [];
    this.simulatePerWatchlistData();
    // Start simulating symbol price updates
    this.symbolPriceService.simulatePriceUpdates();
  }

  private simulatePerWatchlistData(): void {
    this.intervalId = setInterval(() => {
      // For each watchlist, update each trade's price from SymbolPriceService
      this.watchlists = loadWatchlists() || this.watchlists;
      for (let w = 0; w < this.watchlists.length; w++) {
        if (!this.watchlists[w].trades) this.watchlists[w].trades = [];
        for (let t = 0; t < this.watchlists[w].trades.length; t++) {
          const trade = this.watchlists[w].trades[t];
          const prevPrice = trade.price;
          // Get latest price from SymbolPriceService
          const priceObs = this.symbolPriceService.getPrice$(trade.symbol);
          // Subscribe once to get current price
          priceObs.subscribe((newPrice) => {
            // Update price
            trade.price = newPrice;
            // Update trendz
            if (newPrice > prevPrice) {
              trade.trendz = 'arrow_upward';
            } else if (newPrice < prevPrice) {
              trade.trendz = 'arrow_downward';
            }
            trade.timestamp = new Date().toISOString();
          }).unsubscribe();
        }
      }
      saveWatchlists(this.watchlists);
      // Emit the current trades for the selected watchlist (default 0)
      this.messagesSubject.next(this.watchlists[0]?.trades || []);
    }, 2000);
  }

  /** Returns trades for a given watchlist index */
  getTradesForWatchlist(index: number): any[] {
    this.watchlists = loadWatchlists() || this.watchlists;
    return this.watchlists[index]?.trades || [];
  }

  /** Emits trades for the given watchlist index */
  emitTradesForWatchlist(index: number): void {
    this.watchlists = loadWatchlists() || this.watchlists;
    this.messagesSubject.next(this.watchlists[index]?.trades || []);
  }

  /** Helper: generate random trade */
  private randomTrade(tradeId: number) {
    const symbol = ['Toyota', 'Ford', 'BMW', 'Mercedes', 'Audi', 'Nissan'];
    const trendz = ['arrow_upward', 'arrow_downward'];
    const randomsymbol = symbol[Math.floor(Math.random() * symbol.length)];
    const randomTrendz = trendz[Math.floor(Math.random() * trendz.length)];
    return {
      tradeId: 'T' + (1000 + Math.floor(Math.random() * 9000)),
      symbol: randomsymbol,
      trendz: randomTrendz,
      price: Math.floor(Math.random() * 100000) + 50000,
      quantity: Math.floor(Math.random() * 100) + 1,
      timestamp: new Date().toISOString()
    };
  }

  sendMessage(message: any): void {
    // No-op for simulation
  }

  disconnect(): void {
    clearInterval(this.intervalId);
  }
}