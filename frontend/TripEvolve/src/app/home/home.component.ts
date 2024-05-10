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
  option: String = 'upcoming'
  constructor(private headerService: HeaderService,
    private saveItineraryService: SaveItineraryService,
    private storageService: StorageService, public dialog: MatDialog,
    private tripInfoService: TripInfoService
  ) { }

  ngOnInit(): void {
    this.option = 'upcoming'
    this.headerService.setShowHeader(true);
    this.fetchUpcomingSavedTrips();
    
  }
  fetchUpcomingSavedTrips(): void {
    this.saveItineraryService.getUpcomingSavedTrips(this.storageService.getUser().id_user)
      .subscribe(
        (response: any[]) => {
          this.savedTrips = response;
          this.tripInfoService.setTripInfo(this.savedTrips);
          console.log(response);
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
