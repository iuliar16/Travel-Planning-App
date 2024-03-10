import { Component } from '@angular/core';
import { ScheduleService } from '../services/generate-itinerary/schedule-itinerary.service';

@Component({
  selector: 'app-schedule-itinerary',
  templateUrl: './schedule-itinerary.component.html',
  styleUrl: './schedule-itinerary.component.css'
})
export class ScheduleItineraryComponent {
  public itineraryResult: string = ''; 

  constructor(private scheduleService: ScheduleService) {}

  generateSchedule() {
    console.log('here');
    const preferences = {
      preferredLocations: ["catering.restaurant", "commercial.shopping_mall", "tourism"],
    };
    // const preferences = ["catering.restaurant", "commercial.shopping_mall"];
    this.scheduleService.generateSchedule(preferences).subscribe(result => {
      this.itineraryResult = result;
    });
  }
}
