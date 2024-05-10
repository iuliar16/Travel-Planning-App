import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TripInfoService {

  private tripInfo: any;
  private tripDays: { [itineraryId: string]: any[] } = {};
  private tripSubmitted = false;

  constructor() { }

  setTripInfo(info: any) {
    this.tripInfo = info;
  }

  getTripInfo() {
    return this.tripInfo;
  }

  setTripDays(itineraryId: string, tripDays: any[]) {
    this.tripDays[itineraryId] = tripDays;
  }

  getTripDays(itineraryId: string) {
    return this.tripDays[itineraryId];
  }
  submitTrip() {
    this.tripSubmitted = true;
  }

  isTripSubmitted() {
    return this.tripSubmitted;
  }
}
