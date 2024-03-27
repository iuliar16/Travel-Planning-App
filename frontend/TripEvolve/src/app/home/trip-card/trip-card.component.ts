import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteTripPopupComponent } from '../../delete-trip-popup/delete-trip-popup.component';

@Component({
  selector: 'app-trip-card',
  templateUrl: './trip-card.component.html',
  styleUrl: './trip-card.component.css'
})
export class TripCardComponent {
  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(DeleteTripPopupComponent, {
      width: '700px', 
      height: '170px', 
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
}
