import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteTripPopupComponent } from '../../delete-trip-popup/delete-trip-popup.component';
import { Router } from '@angular/router';
import { PublicShareComponent } from '../../public-share/public-share.component';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-trip-card',
  templateUrl: './trip-card.component.html',
  styleUrl: './trip-card.component.css'
})
export class TripCardComponent {
  @Input() trip: any;
  @Input() totalTripCards: any;
  @Input() isPopupOpen: any;
  @Output() itineraryDeleted = new EventEmitter<number>();
  @Output() popupStateChanged = new EventEmitter<any>();

  constructor(public dialog: MatDialog, private router: Router) { }

  openDialog(itineraryId: number, container: HTMLElement): void {
    const containerRect = container.getBoundingClientRect();
    const size = containerRect.height * this.totalTripCards;

    const dialogRef = this.dialog.open(DeleteTripPopupComponent, {
      width: '700px',
      height: '170px',
      position: {
        top: `${-size}px`,
        left: `30%`
      },
      backdropClass: 'bdrop',
      data: { itineraryId: itineraryId },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.isPopupOpen = !this.isPopupOpen;
      this.popupStateChanged.emit(this.isPopupOpen);
    });
    dialogRef.componentInstance.itineraryDeleted.subscribe((itineraryId: number) => {
      this.itineraryDeleted.emit(itineraryId);
    });
    this.isPopupOpen = !this.isPopupOpen;
    this.popupStateChanged.emit(this.isPopupOpen);
  }
  getPhotoUrl(photoReference: string): string {
    const apiKey = 'AIzaSyCbqdF-F4bLlH8giQESqHFfi0tIyTtEuPw';
    const maxWidth = 400;
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${apiKey}`;

  }
  navigateToViewTrip(id: number): void {
    this.router.navigate(['/view-trip'], { queryParams: { id: id } });
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
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
