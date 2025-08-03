import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent, GridOptions } from 'ag-grid-community';
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
ModuleRegistry.registerModules([AllCommunityModule]);

// my-custom-cell-renderer.component.ts
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { NgStyle, CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { WebSocketService } from '../services/ws.service';
import { Router, ActivatedRoute } from '@angular/router';
import { WATCHLISTS } from '../watchlists';

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
  imports: [CommonModule, FormsModule, AgGridAngular, MatIconModule,
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
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './trade-list.component.html',
  styleUrl: './trade-list.component.css'
})

export class TradeListComponent implements OnInit {
  rowData: any[] = [];
  filteredRowData: any[] = [];
  filterSymbol: string = '';
  filterTrend: string = '';
  filterMinPrice: number | null = null;
  filterMaxPrice: number | null = null;
  loading: boolean = false;
  filterType: any;
  public gridApi?: GridApi;
  defaultColDef: any = {
    flex: 1,
    minWidth: 100
  }
  private websocketSubscription?: Subscription;

  constructor(private socketService: WebSocketService, private router: ActivatedRoute) {
    this.router.queryParams.subscribe(params => {
      const watchlistIndex = params['watchlist'] ? +params['watchlist'] : 0;
      this.socketService.emitTradesForWatchlist(watchlistIndex);
      this.filterType = params['trendz'];
    });
  }

  ngOnInit() {
    this.loading = true;
    this.websocketSubscription = this.socketService.messages.subscribe(data => {
      this.loading = true;
      setTimeout(() => {
        this.rowData = data;
        this.applyFilters();
        this.loading = false;
      }, 500); // Simulate loading
    });
  }

  colDefs: any[] = [
    { headerName: 'Trendz', field: 'trendz', cellRenderer: IconCellRendererComponent },
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

  applyFilters() {
    this.filteredRowData = this.rowData.filter(row => {
      const matchesSymbol = !this.filterSymbol || row.symbol?.toLowerCase().includes(this.filterSymbol.toLowerCase());
      const matchesTrend = !this.filterTrend || row.trendz === this.filterTrend;
      const matchesMin = this.filterMinPrice == null || row.price >= this.filterMinPrice;
      const matchesMax = this.filterMaxPrice == null || row.price <= this.filterMaxPrice;
      return matchesSymbol && matchesTrend && matchesMin && matchesMax;
    });
  }

  clearFilters() {
    this.filterSymbol = '';
    this.filterTrend = '';
    this.filterMinPrice = null;
    this.filterMaxPrice = null;
    this.applyFilters();
  }

  ngOnDestroy(): void {
    if (this.websocketSubscription) {
      this.websocketSubscription.unsubscribe(); // Unsubscribe to prevent memory leaks
    }
    this.socketService.disconnect(); // Disconnect when the component is destroyed
  }
}

