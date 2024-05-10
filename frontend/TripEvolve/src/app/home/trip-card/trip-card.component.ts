import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteTripPopupComponent } from '../../delete-trip-popup/delete-trip-popup.component';
import { Router } from '@angular/router';
import { PublicShareComponent } from '../../public-share/public-share.component';

@Component({
  selector: 'app-trip-card',
  templateUrl: './trip-card.component.html',
  styleUrl: './trip-card.component.css'
})
export class TripCardComponent {
  @Input() trip: any;  
  @Output() itineraryDeleted = new EventEmitter<number>();
  constructor(public dialog: MatDialog,private router: Router) {}

  openDialog(itineraryId: number): void {
    const dialogRef = this.dialog.open(DeleteTripPopupComponent, {
      width: '700px', 
      height: '170px', 
      position: {
        top: '-400px', 
        left: '30%' 
      },
      backdropClass: 'bdrop',
      data: { itineraryId: itineraryId } 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
    dialogRef.componentInstance.itineraryDeleted.subscribe((itineraryId: number) => {
      this.itineraryDeleted.emit(itineraryId);
    });
  }
  getPhotoUrl(photoReference: string): string {
    const apiKey = 'AIzaSyCbqdF-F4bLlH8giQESqHFfi0tIyTtEuPw';
    const maxWidth = 400;
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${apiKey}`;

  }
  navigateToViewTrip(id: number): void {
    this.router.navigate(['/view-trip'], { queryParams: { id: id }});
  }
  
  
  openPublicShareDialog(itineraryId: number): void {
    const dialogRef = this.dialog.open(PublicShareComponent, {
      data: { itineraryId: itineraryId },
      width: '700px', 
      height: '175px', 
      position: {
        top: '-400px', 
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
