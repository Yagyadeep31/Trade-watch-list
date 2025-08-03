export interface Trade {
  tradeId: string;
  symbol: string;
  price: number;
  quantity: number;
  trendz: string;
  timestamp: string;
}

export interface Watchlist {
  name: string;
  description: string;
  color?: string;
  trades: Trade[];
}

export const WATCHLISTS: Watchlist[] = [
  {
    name: 'WatchList 1',
    description: 'Show All Trades which are up',
    color: '#1976D2',
    trades: [
      { tradeId: 'T001', symbol: 'AAPL', price: 170.50, quantity: 100, trendz: 'arrow_upward', timestamp: '2025-07-20T10:00:00Z' },
      { tradeId: 'T002', symbol: 'GOOGL', price: 1500.25, quantity: 50, trendz: 'arrow_upward', timestamp: '2025-07-20T10:05:00Z' }
    ]
  },
  {
    name: 'WatchList 2',
    description: 'Show All Trades which are down',
    color: '#D32F2F',
    trades: [
      { tradeId: 'T003', symbol: 'MSFT', price: 320.10, quantity: 75, trendz: 'arrow_downward', timestamp: '2025-07-20T10:10:00Z' },
      { tradeId: 'T004', symbol: 'TSLA', price: 700.00, quantity: 30, trendz: 'arrow_downward', timestamp: '2025-07-20T10:15:00Z' }
    ]
  }
];
