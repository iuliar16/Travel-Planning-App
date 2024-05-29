import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteTripPopupComponent } from '../../delete-trip-popup/delete-trip-popup.component';
import { Router } from '@angular/router';
import { PublicShareComponent } from '../../public-share/public-share.component';
import { MatButton } from '@angular/material/button';
import { SaveItineraryService } from '../../services/save-itinerary/save-itinerary.service';
import { Clipboard } from '@angular/cdk/clipboard';

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
  shareableLink: string = '';
  linkCopied: boolean = false;
  openLinkTab: boolean = false;

  constructor(public dialog: MatDialog, private router: Router,
    private clipboard: Clipboard, private saveItineraryService: SaveItineraryService
  ) { }

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
      this.isPopupOpen = false;
      this.popupStateChanged.emit(false);
    });
    dialogRef.componentInstance.itineraryDeleted.subscribe((itineraryId: number) => {
      this.itineraryDeleted.emit(itineraryId);
      this.isPopupOpen = false;
      this.popupStateChanged.emit(false);
    });
    this.isPopupOpen = true;
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

  copyLink() {
    this.clipboard.copy(this.shareableLink);
    this.linkCopied = true;
    setTimeout(() => {
      this.linkCopied = false;
    }, 1000);
  }
  shareTrip(tripId: number) {
    this.saveItineraryService.generateShareableLink(tripId)
      .subscribe(response => {
        this.shareableLink = response;
        this.openLinkTab = !this.openLinkTab;

      }, error => {
        console.error('Error generating link:', error);
      });
  }


}
