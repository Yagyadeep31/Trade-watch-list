// Utility for local storage persistence

export function saveWatchlists(watchlists: any[]) {
  localStorage.setItem('trade_watchlists', JSON.stringify(watchlists));
}

export function loadWatchlists(): any[] | null {
  const data = localStorage.getItem('trade_watchlists');
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      return null;
    }
  }
  return null;
}
