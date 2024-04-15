import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteTripPopupComponent } from '../../delete-trip-popup/delete-trip-popup.component';

@Component({
  selector: 'app-trip-card',
  templateUrl: './trip-card.component.html',
  styleUrl: './trip-card.component.css'
})
export class TripCardComponent {
  @Input() trip: any; 
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
  getPhotoUrl(photoReference: string): string {
    const apiKey = 'AIzaSyCbqdF-F4bLlH8giQESqHFfi0tIyTtEuPw';
    const maxWidth = 400;
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${apiKey}`;

  }
}
