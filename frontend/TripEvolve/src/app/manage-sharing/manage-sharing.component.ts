import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ShareTripPopupComponent } from '../share-trip-popup/share-trip-popup.component';
import { PublicShareComponent } from '../public-share/public-share.component';

export interface DialogData {
  name: string;
}

@Component({
  selector: 'app-manage-sharing',
  templateUrl: './manage-sharing.component.html',
  styleUrl: './manage-sharing.component.css'
})
export class ManageSharingComponent {
  name: string | undefined;
  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(ShareTripPopupComponent, {
      data: {name: this.name},
      width: '700px', 
      height: '600px', 
      position: {
        top: '-200px', 
        left: '27%' 
      },
      backdropClass: 'bdrop'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openPublicShareDialog(): void {
    const dialogRef = this.dialog.open(PublicShareComponent, {
      data: {name: this.name},
      width: '700px', 
      height: '175px', 
      position: {
        top: '-100px', 
        left: '27%' 
      },
      backdropClass: 'bdrop',
      autoFocus:false,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
