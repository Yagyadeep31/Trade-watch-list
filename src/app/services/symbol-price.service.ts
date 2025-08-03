import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Service to fetch and update per-symbol prices.
 * This can be replaced with real API calls if needed.
 */
@Injectable({ providedIn: 'root' })
export class SymbolPriceService {
  private priceMap: Map<string, BehaviorSubject<number>> = new Map();

  /**
   * Get observable for a symbol's price. Creates one if it doesn't exist.
   */
  getPrice$(symbol: string): Observable<number> {
    if (!this.priceMap.has(symbol)) {
      // Initialize with a random price for demo
      this.priceMap.set(symbol, new BehaviorSubject<number>(this.randomPrice(symbol)));
    }
    return this.priceMap.get(symbol)!.asObservable();
  }

  /**
   * Set or update the price for a symbol (e.g., from polling or websocket).
   */
  setPrice(symbol: string, price: number) {
    if (!this.priceMap.has(symbol)) {
      this.priceMap.set(symbol, new BehaviorSubject<number>(price));
    } else {
      this.priceMap.get(symbol)!.next(price);
    }
  }

  /**
   * Simulate price changes for all tracked symbols (for demo/testing).
   */
  simulatePriceUpdates() {
    setInterval(() => {
      this.priceMap.forEach((subject, symbol) => {
        const last = subject.value;
        // Simulate a small random walk
        const next = parseFloat((last + (Math.random() - 0.5) * 2).toFixed(2));
        subject.next(next);
      });
    }, 2000);
  }

  /**
   * Generate a random price for a symbol (demo only).
   */
  private randomPrice(symbol: string): number {
    // Just a deterministic pseudo-random price for demo
    let hash = 0;
    for (let i = 0; i < symbol.length; i++) {
      hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs((hash % 1000) + 100 + Math.random() * 50);
  }
}
