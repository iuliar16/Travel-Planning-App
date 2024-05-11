import { Component } from '@angular/core';
import { SaveItineraryService } from '../services/save-itinerary/save-itinerary.service';
import { StorageService } from '../services/storage/storage.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteTripPopupComponent } from '../delete-trip-popup/delete-trip-popup.component';
import { TripInfoService } from '../services/trip-info/trip-info.service';
import { HeaderService } from '../services/header/header.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  savedTrips: any[] = [];
  option: String = 'upcoming';
  isPopupOpen: any = false;
  emptyMessage: string = '';

  constructor(private headerService: HeaderService,
    private saveItineraryService: SaveItineraryService,
    private storageService: StorageService, public dialog: MatDialog,
    private tripInfoService: TripInfoService
  ) { }

  onPopupStateChanged(isOpen: any): void {
    this.isPopupOpen = isOpen;
    console.log(this.isPopupOpen)
  }

  ngOnInit(): void {
    this.headerService.setShowHeader(true);
    if (this.option = 'upcoming')
      this.fetchUpcomingSavedTrips();
    else
      this.fetchPastSavedTrips();
    if (this.savedTrips.length == 0)
      this.emptyMessage = 'Looks like you do not have any upcoming trips.'
    else
      this.emptyMessage='';

  }
  fetchUpcomingSavedTrips(): void {
    this.saveItineraryService.getUpcomingSavedTrips(this.storageService.getUser().id_user)
      .subscribe(
        (response: any[]) => {
          this.savedTrips = response;
          this.tripInfoService.setTripInfo(this.savedTrips);
          console.log(response);
          if (this.savedTrips.length == 0)
            this.emptyMessage = 'Looks like you do not have any upcoming trips.'
          else
            this.emptyMessage = '';
        },
        error => {
          console.error('Error fetching saved trips:', error);
        }
      );
  }
  fetchPastSavedTrips(): void {
    this.saveItineraryService.getPastSavedTrips(this.storageService.getUser().id_user)
      .subscribe(
        (response: any[]) => {
          this.savedTrips = response;
          this.tripInfoService.setTripInfo(this.savedTrips);
          console.log(response);
          if (this.savedTrips.length == 0)
            {console.log('yes');
            this.emptyMessage = 'Looks like you do not have any past trips.'}
          else
            this.emptyMessage = '';
        },
        error => {
          console.error('Error fetching saved trips:', error);
        }
      );
  }

  toggleOption(opt: String) {
    if (opt == 'upcoming') {
      this.option = 'upcoming';
      this.fetchUpcomingSavedTrips();
     
    }
    else
      if (opt == 'past') {
        this.option = 'past';
        this.fetchPastSavedTrips();
       
      }

  }
  onTripDeleted(deletedItineraryId: number) {
    const index = this.savedTrips.findIndex(trip => trip.itinerary_id === deletedItineraryId);
    if (index !== -1) {
      this.savedTrips.splice(index, 1);
    }
  }

}
