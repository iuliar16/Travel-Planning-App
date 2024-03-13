import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from '../manage-sharing/manage-sharing.component';

@Component({
  selector: 'app-share-trip-popup',
  templateUrl: './share-trip-popup.component.html',
  styleUrl: './share-trip-popup.component.css'
})
export class ShareTripPopupComponent {

  constructor(
    public dialogRef: MatDialogRef<ShareTripPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
