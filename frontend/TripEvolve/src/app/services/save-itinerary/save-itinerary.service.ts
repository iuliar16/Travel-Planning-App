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

  getAllSavedTrips(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/itinerary`);
  }
  getSavedTrips(userId:any): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/itinerary/userId?userId=${userId}`);
  }
  getUpcomingSavedTrips(userId:any): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/itinerary/userId/${userId}/future`);
  }
  getPastSavedTrips(userId:any): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/itinerary/userId/${userId}/past`);
  }

  getTripInfo(itineraryId:any): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/itineraryLocations/itineraryId?itineraryId=${itineraryId}`);
  }
  getLocationInfo(locationId:any): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/location/${locationId}`);
  }

  generateShareableLink(itineraryId: number): Observable<string> {
    return this.http.post(`${this.baseUrl}/itinerary/${itineraryId}/generate-shareable-link`, {}, { responseType: 'text' });
  }


  getItineraryByShareableLink(shareableLink: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/itinerary/share/${shareableLink}`);
  }
}
