import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DeleteTripService } from '../services/delete-trip/delete-trip.service';

interface DialogData {
  itineraryId: number;
}

@Component({
  selector: 'app-delete-trip-popup',
  templateUrl: './delete-trip-popup.component.html',
  styleUrls: ['./delete-trip-popup.component.css']
})
export class DeleteTripPopupComponent {
  @Output() itineraryDeleted = new EventEmitter<number>();

  constructor(
    public dialogRef: MatDialogRef<DeleteTripPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private deleteTripService: DeleteTripService
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirmClick(): void {
    this.deleteTripService.deleteItineraryLocations(this.data.itineraryId).subscribe({
      next: () => {
        console.log('Itinerary locations deleted successfully');
        this.deleteTripService.deleteItinerary(this.data.itineraryId).subscribe({
          next: () => {
            console.log('Itinerary deleted successfully');
            this.itineraryDeleted.emit(this.data.itineraryId);
          },
          error: (error) => {
            console.error('Error deleting itinerary', error);
          }
        });
      },
      error: (error) => {
        console.error('Error deleting itinerary locations:', error);
      }
    });
  }
}
