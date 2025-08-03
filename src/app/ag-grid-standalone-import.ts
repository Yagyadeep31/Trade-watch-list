import { importProvidersFrom } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';

export const provideAgGrid = () => importProvidersFrom(AgGridModule);
