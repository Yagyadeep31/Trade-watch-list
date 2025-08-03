import { Component, Inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rename-watchlist-dialog',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <h2 mat-dialog-title>Rename Watchlist</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" style="width: 100%">
        <mat-label>New Name</mat-label>
        <input matInput [(ngModel)]="data.name" />
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onRename()" [disabled]="!data.name.trim()">Rename</button>
    </mat-dialog-actions>
  `
})
export class RenameWatchlistDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<RenameWatchlistDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string }
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onRename(): void {
    this.dialogRef.close(this.data.name.trim());
  }
}
