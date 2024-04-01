import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from '../manage-sharing/manage-sharing.component';
import { StorageService } from '../services/storage/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-out-popup',
  templateUrl: './sign-out-popup.component.html',
  styleUrl: './sign-out-popup.component.css'
})
export class SignOutPopupComponent {
  constructor(
    public dialogRef: MatDialogRef<SignOutPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
     private storageService: StorageService,
     private router: Router
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onLogoutConfirmation(response: boolean): void {
    this.dialogRef.close();

    if (response === true) {
      this.storageService.logout();
      this.router.navigate(['/intro']);
    }
  }
}
