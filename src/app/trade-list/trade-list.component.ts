import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { provideGlobalGridOptions } from 'ag-grid-community';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar'; 
import { MatButtonModule } from '@angular/material/button'; 
import { MatSidenavModule } from '@angular/material/sidenav'; 
import { MatListModule } from '@angular/material/list'; 
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input'; 
import { MatSelectModule } from '@angular/material/select'; 
import { MatTableModule } from '@angular/material/table'; 
import { MatCardModule } from '@angular/material/card';
import { Subscription } from 'rxjs';
// Mark all grids as using legacy themes
provideGlobalGridOptions({ theme: "legacy" });    
ModuleRegistry.registerModules([ AllCommunityModule ]);

// my-custom-cell-renderer.component.ts
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { NgStyle } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { WebSocketService } from '../services/ws.service';

@Component({
  selector: 'app-icon-cell-renderer',
  standalone: true,
  imports: [MatIconModule, NgStyle],
  template: `<mat-icon [ngStyle]="{'color': iconName === 'arrow_downward' ? 'red' : 'green'}" >{{iconName}}</mat-icon>`,
})
export class IconCellRendererComponent implements ICellRendererAngularComp {
  public iconName: string = '';
  private params: any;

  agInit(params: any): void {
    this.params = params;
    this.iconName = params.value; // Assuming the cell value is the icon name
  }

  refresh(params: any): boolean {
    this.params = params;
    this.iconName = params.value;
    return true;
  }
}

@Component({
  selector: 'app-trade-list',
  standalone: true,
  imports: [ AgGridAngular, MatIconModule,
    ReactiveFormsModule, 
    MatToolbarModule, 
    MatButtonModule,
    MatIconModule, 
    MatSidenavModule, 
    MatListModule,
    MatFormFieldModule, 
    MatInputModule,
    MatSelectModule, 
    MatTableModule, 
    MatCardModule
  
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  templateUrl: './trade-list.component.html',
  styleUrl: './trade-list.component.css'
})

export class TradeListComponent implements OnInit {
  rowData: any[] = [];
  public gridApi?: GridApi;
  defaultColDef: any ={
    flex: 1,
    minWidth:100
  }
  private websocketSubscription?: Subscription ;
  constructor(private socketService: WebSocketService) {



    this.rowData = [
      { tradeId: 'T001', symbol: 'AAPL', price: 170.50, quantity: 100, trendz: 'arrow_upward' , timestamp: '2025-07-20T10:00:00Z' },
      { tradeId: 'T002', symbol: 'GOOGL', price: 1500.25, quantity: 50,trendz: 'arrow_upward', timestamp: '2025-07-20T10:05:00Z' },
      { tradeId: 'T001', symbol: 'AAPL', price: 170.50, quantity: 100, trendz: 'arrow_upward',timestamp: '2025-07-20T10:00:00Z' },
      { tradeId: 'T002', symbol: 'GOOGL', price: 1500.25, quantity: 50,trendz: 'arrow_downward', timestamp: '2025-07-20T10:05:00Z' },
      { tradeId: 'T001', symbol: 'AAPL', price: 170.50, quantity: 100, trendz: 'arrow_upward',timestamp: '2025-07-20T10:00:00Z' },
      { tradeId: 'T002', symbol: 'GOOGL', price: 1500.25, quantity: 50,trendz: 'arrow_downward', timestamp: '2025-07-20T10:05:00Z' },
      { tradeId: 'T001', symbol: 'AAPL', price: 170.50, quantity: 100,trendz: 'arrow_upward', timestamp: '2025-07-20T10:00:00Z' },
      { tradeId: 'T002', symbol: 'GOOGL', price: 1500.25, quantity: 50,trendz: 'arrow_downward', timestamp: '2025-07-20T10:05:00Z' },
      { tradeId: 'T001', symbol: 'AAPL', price: 170.50, quantity: 100, trendz: 'arrow_upward',timestamp: '2025-07-20T10:00:00Z' },
      { tradeId: 'T002', symbol: 'GOOGL', price: 1500.25, quantity: 50,trendz: 'arrow_downward', timestamp: '2025-07-20T10:05:00Z' },

      // ... more trade data
  ];
  }

  ngOnInit () {
    this.websocketSubscription = this.socketService.messages.subscribe(data => {
      console.log('Received data from WebSocket:', data);
      if (this.gridApi) {
          // If it's the initial data, set rowData directly
          if (data.length > 1) { // Assuming initial data is an array of multiple rows
              this.rowData = data;
          } else {
              // For subsequent updates, use applyTransactionAsync for efficiency
              this.gridApi.applyTransactionAsync({ update: data });
          }
      }
  });
  }

  colDefs: any[] = [
    { headerName: 'Trendz', field: 'trendz',  cellRenderer: IconCellRendererComponent },
    { headerName: 'Trade ID', field: 'tradeId' },
    { headerName: 'Symbol', field: 'symbol' },
    { headerName: 'Price', field: 'price' },
    { headerName: 'Quantity', field: 'quantity' },
    { headerName: 'Timestamp', field: 'timestamp' },
    // Add more columns as needed for your trade data
];

onGridReady(params: any): void {
  this.gridApi = params.api;
}

public getRowId = (params: any) => params.data.id;

ngOnDestroy(): void {
  if (this.websocketSubscription) {
    this.websocketSubscription.unsubscribe(); // Unsubscribe to prevent memory leaks
  }
  this.socketService.disconnect(); // Disconnect when the component is destroyed
}


}
