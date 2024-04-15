import { Component } from '@angular/core';
import { SaveItineraryService } from '../services/save-itinerary/save-itinerary.service';
import { StorageService } from '../services/storage/storage.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteTripPopupComponent } from '../delete-trip-popup/delete-trip-popup.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  savedTrips: any[] = [];
  constructor(private saveItineraryService: SaveItineraryService,
    private storageService: StorageService, public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.saveItineraryService.getSavedTrips(this.storageService.getUser().id_user).subscribe(
      (response: any[]) => {
        this.savedTrips = response;
        console.log(response);
      },
      error => {
        console.error('Error fetching saved trips:', error);
      }
    );
  }
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
