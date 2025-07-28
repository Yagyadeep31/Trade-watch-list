import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TradeServiceService {

  constructor( private http: HttpClient) { }

  create(data: any) {
   // return this.http.post("http://localhost:8000/api/message", data);
  }
}
