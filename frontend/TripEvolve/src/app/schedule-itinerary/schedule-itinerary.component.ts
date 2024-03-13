import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ScheduleService } from '../services/generate-itinerary/schedule-itinerary.service';
import { } from 'googlemaps';


@Component({
  selector: 'app-schedule-itinerary',
  templateUrl: './schedule-itinerary.component.html',
  styleUrl: './schedule-itinerary.component.css'
})

export class ScheduleItineraryComponent implements AfterViewInit  {
  @ViewChild('gmapContainer', { static: false })
  gmap!: ElementRef;
  title = 'angular-gmap';
  public itineraryResult: string = '';
  map!: google.maps.Map;
  lat = 12.9716; lng = 77.5946;
  coordinates = new google.maps.LatLng(this.lat, this.lng);
  mapOptions: google.maps.MapOptions = { center: this.coordinates, zoom: 10, };
  marker = new google.maps.Marker({ position: this.coordinates, map: this.map, });

  constructor(private scheduleService: ScheduleService) { }
  ngAfterViewInit(): void {
    this.mapInitializer();
  }

  mapInitializer() {
    this.map = new google.maps.Map(this.gmap.nativeElement, 
     this.mapOptions);
     this.marker.setMap(this.map);
   }

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
