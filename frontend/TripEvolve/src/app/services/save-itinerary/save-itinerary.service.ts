import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaveItineraryService {

  private baseUrl = 'http://localhost:8080/tripEvolve/api';

  constructor(private http: HttpClient) { }

  saveItinerary(itineraryData: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<any>(`${this.baseUrl}/itinerary`, itineraryData, httpOptions)
      .pipe(
        catchError(error => {
          console.error('Error saving itinerary:', error);
          throw error;
        })
      );
  }
  saveLocation(locationData: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<any>(`${this.baseUrl}/location`, locationData, httpOptions)
      .pipe(
        catchError(error => {
          console.error('Error saving location:', error);
          throw error;
        })
      );
  }

  saveItineraryLocations(itineraryLocationData: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<any>(`${this.baseUrl}/itineraryLocations`, itineraryLocationData, httpOptions)
      .pipe(
        catchError(error => {
          console.error('Error saving itinerarylocation:', error);
          throw error;
        })
      );
  }
  getSavedTrips(userId:any): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/itinerary/userId?userId=${userId}`);
  }
}
