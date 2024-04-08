import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AddTripService {
  tripName: string = '';
  city: string = '';
  selectedOption: string = '';
  selectedLocations: string[] = [];
  locationPreferences: Map<string, number> = new Map<string, number>();
  tripLength: number=1;
  startDate:Date | undefined;
  endDate:Date | undefined;
  placeName: string = '';


  constructor() { }

  setFormData(data: any) {
    this.tripName = data.tripName;
    this.city = data.location;
    this.selectedOption = data.selectedOption;
    this.selectedLocations = data.selectedLocations || [];
    this.tripLength=data.tripLength;
    this.startDate=data.startDate;
    this.endDate=data.endDate;
    this.placeName=data.placeName;
    this.locationPreferences=data.locationPreferences;
  }

  getTripSummary(): any {
    return {
      tripName: this.tripName,
      city: this.city,
      selectedOption: this.selectedOption,
      selectedLocations: this.selectedLocations,
      tripLength:this.tripLength,
      startDate:this.startDate,
      endDate:this.endDate,
      placeName:this.placeName,
      locationPreferences:this.locationPreferences
    };
  }
}
