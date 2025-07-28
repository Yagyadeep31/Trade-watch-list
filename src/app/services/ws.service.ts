import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket = new WebSocket('ws://localhost:8080');
  private messagesSubject = new Subject<any>();
  public messages = this.messagesSubject.asObservable();

  constructor() {
    this.connect();
  }

  private connect(): void {

    this.socket.onopen = (event) => {
      console.log('WebSocket connection established', event);
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.messagesSubject.next(data);
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket connection closed', event);
      // Optional: Implement reconnection logic here
    };

    this.socket.onerror = (event) => {
     // console.error('WebSocket error:', event);
    };
  }

  sendMessage(message: any): void {
    this.socket.send(JSON.stringify(message));
  }

  disconnect(): void {
    this.socket.close();
  }
}