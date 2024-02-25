import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private http: HttpClient) { }

  generateSchedule(preferences: any) {
    return this.http.post('http://localhost:8080/tripEvolve/api/itinerary/generate-schedule', preferences, { responseType: 'text' });
  }
}
