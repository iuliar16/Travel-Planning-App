import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from '../manage-sharing/manage-sharing.component';

@Component({
  selector: 'app-delete-trip-popup',
  templateUrl: './delete-trip-popup.component.html',
  styleUrl: './delete-trip-popup.component.css'
})
export class DeleteTripPopupComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteTripPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
