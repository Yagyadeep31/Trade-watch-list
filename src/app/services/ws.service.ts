import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/dist/types/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket$: WebSocketSubject<any>;

  constructor() {
    this.socket$ = webSocket('wss://your-websocket-server-url'); // Replace with your WebSocket server URL
  }

  getMessages(): Observable<any> {
    return this.socket$.asObservable();
  }

  sendMessage(message: any) {
    this.socket$.next(message);
  }

  closeConnection() {
    this.socket$.complete();
  }
}