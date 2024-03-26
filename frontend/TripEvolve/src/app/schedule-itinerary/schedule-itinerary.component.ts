import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ScheduleService } from '../services/generate-itinerary/schedule-itinerary.service';
import { } from 'googlemaps';
import { HeaderService } from '../services/header/header.service';
import { Router } from '@angular/router';
import { AddTripService } from '../services/add-trip/add-trip.service';


@Component({
  selector: 'app-schedule-itinerary',
  templateUrl: './schedule-itinerary.component.html',
  styleUrl: './schedule-itinerary.component.css'
})

export class ScheduleItineraryComponent implements AfterViewInit, OnInit {
  tripDays = [
    { dayNumber: 1, day: 'Wednesday', date: 'March 13th', expanded: true },
    { dayNumber: 2, day: 'Thursday', date: 'March 14th', expanded: true },
    { dayNumber: 3, day: 'Friday', date: 'March 15th', expanded: true },
  ];
  places = [
    {
      dayNumber: 1, name: 'Colloseum', description: "The Colloseum is an elliptical amphitheatre in the centre of the city of Rome, Italy, just east of the Roman Forum.", arrive_hour: "9:00", leave_hour: '11:00'
    },
  ];
  tripName: string = '';
  location: string = '';
  selectedDate: Date | null = null;
  tripLength: number = 1;
  selectedLocations: string[] = [];

  tripSummary: any = {};
  showSchedule: boolean = false;
  loading: boolean = false; 


  @ViewChild('gmapContainer', { static: false })
  gmap!: ElementRef;
  title = 'angular-gmap';
  public itineraryResult: string = '';
  map!: google.maps.Map;
  lat = 12.9716; lng = 77.5946;
  coordinates = new google.maps.LatLng(this.lat, this.lng);
  mapOptions: google.maps.MapOptions = { center: this.coordinates, zoom: 10, };
  marker = new google.maps.Marker({ position: this.coordinates, map: this.map, });


  constructor(private router: Router, private scheduleService: ScheduleService,
    private headerService: HeaderService, private addTripService: AddTripService) {
    this.tripSummary = this.addTripService.getTripSummary();
  }

  toggleDay(day: any) {
    day.expanded = !day.expanded;
    console.log(day.expanded)
  }

  ngAfterViewInit(): void {
    this.mapInitializer();
  }

  mapInitializer() {
    this.map = new google.maps.Map(this.gmap.nativeElement,
      this.mapOptions);
    this.marker.setMap(this.map);
  }

  generateSchedule() {
    this.loading = true; 
    setTimeout(() => {
      console.log('here');
      const preferences = {
        preferredLocations: this.tripSummary.selectedLocations,
      };

      this.showSchedule = true;
      this.loading = false; 
      this.scheduleService.generateSchedule(preferences).subscribe(result => {
        this.itineraryResult = result;
        console.log(result);
      });
    }, 6000);

  }

  ngOnInit(): void {
    this.headerService.setShowHeader(false);
    this.tripSummary = this.addTripService.getTripSummary();
    console.log(this.tripSummary); 
  }
  goBack(): void {
    this.router.navigate(['/home']);
  }
}
