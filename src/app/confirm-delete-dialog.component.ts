import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-delete-dialog',
  standalone: true,
  imports: [MatButtonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <h2 mat-dialog-title>Delete Watchlist</h2>
    <mat-dialog-content>
      Are you sure you want to delete this watchlist?
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="warn" (click)="onDelete()">Delete</button>
    </mat-dialog-actions>
  `
})
export class ConfirmDeleteDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onDelete(): void {
    this.dialogRef.close(true);
  }
}
