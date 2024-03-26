import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AddTripService {
  tripName: string = '';
  city: string = '';
  selectedOption: string = '';
  selectedLocations: string[] = [];
  tripLength: number=1;

  constructor() { }

  setFormData(data: any) {
    this.tripName = data.tripName;
    this.city = data.location;
    this.selectedOption = data.selectedOption;
    this.selectedLocations = data.selectedLocations || [];
    this.tripLength=data.tripLength;
  }

  getTripSummary(): any {
    return {
      tripName: this.tripName,
      city: this.city,
      selectedOption: this.selectedOption,
      selectedLocations: this.selectedLocations,
      tripLength:this.tripLength
    };
  }
}
