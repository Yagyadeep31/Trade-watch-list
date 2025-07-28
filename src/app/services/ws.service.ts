import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket = new WebSocket('https://ws.ifelse.io/');
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

      let rowIdCounter = 0;
      let gridData = [];

      for (let i = 0; i < 10; i++) {
        gridData.push(createNewRowData());
      }

      function createNewRowData() {
        rowIdCounter++;
        const symbol = ['Toyota', 'Ford', 'BMW', 'Mercedes', 'Audi', 'Nissan'];
        const trendz = ['arrow_upward', 'arrow_downward', 'arrow_upward', 'arrow_downward', 'arrow_downward', 'arrow_downward'];
        const randomsymbol = symbol[Math.floor(Math.random() * symbol.length)];
        const randomTrendz = trendz[Math.floor(Math.random() * trendz.length)];


        const startDate = new Date(2020, 0, 1); // January 1, 2020
        const endDate = new Date(); // Current date and time
        const randomDate = getRandomDate(startDate, endDate);

        function getRandomDate(startDate: Date, endDate: Date) {
          const fromTime = startDate.getTime(); // Get milliseconds from start date
          const toTime = endDate.getTime();   // Get milliseconds from end date
          return new Date(fromTime + Math.random() * (toTime - fromTime)); // Calculate random point within the range and create new Date
        }
        return {
          tradeId: rowIdCounter,
          symbol: randomsymbol,
          trendz: randomTrendz,
          price: Math.floor(Math.random() * 100000) + 50000,
          quantity: Math.floor(Math.random() * 100) + 1,
          timestamp: randomDate
        };
      }



      const data = JSON.parse(JSON.stringify(gridData));
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