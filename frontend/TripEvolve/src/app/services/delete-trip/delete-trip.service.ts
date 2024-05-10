import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeleteTripService {


  constructor(private http: HttpClient) { }


  deleteItineraryLocations(itineraryId: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8080/tripEvolve/api/itineraryLocations/itinerary/${itineraryId}`);
  }
  deleteItinerary(itineraryId: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8080/tripEvolve/api/itinerary/${itineraryId}`);
  }
}

