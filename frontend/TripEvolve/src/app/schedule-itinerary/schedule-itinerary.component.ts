import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ScheduleService } from '../services/generate-itinerary/schedule-itinerary.service';
import { } from 'googlemaps';
import { HeaderService } from '../services/header/header.service';
import { Router } from '@angular/router';
import { AddTripService } from '../services/add-trip/add-trip.service';

interface DayAbbreviationMap {
  [key: string]: number;
}
@Component({
  selector: 'app-schedule-itinerary',
  templateUrl: './schedule-itinerary.component.html',
  styleUrl: './schedule-itinerary.component.css'
})

export class ScheduleItineraryComponent implements AfterViewInit, OnInit {
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
  nr_days: string = 'days'
  itineraryResults: any[] = [];
  daysDifference: number = 1;
  tripDays: any[] = [];
  tripSummary: any = {};
  showSchedule: boolean = false;
  loading: boolean = false;
  selectedDay: number | null = null;
  cityName: string = '';

  dayAbbreviationToIndex: DayAbbreviationMap = {
    'Su': 0, 'Mo': 1, 'Tu': 2, 'We': 3, 'Th': 4, 'Fr': 5, 'Sa': 6
  };

  @ViewChild('gmapContainer', { static: false })
  gmap!: ElementRef;
  title = 'angular-gmap';
  map!: google.maps.Map;
  lat = 12.9716; lng = 77.5946;
  coordinates = new google.maps.LatLng(this.lat, this.lng);
  mapOptions: google.maps.MapOptions = { center: this.coordinates, zoom: 0, };
  marker = new google.maps.Marker({ position: this.coordinates, map: this.map, });
  markers: google.maps.Marker[] = [];
  pathPoints: google.maps.LatLngLiteral[] = [];


  constructor(private router: Router, private scheduleService: ScheduleService,
    private headerService: HeaderService, private addTripService: AddTripService,
  ) {
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
    if (this.gmap) {
      this.map = new google.maps.Map(this.gmap.nativeElement);
      this.map.setZoom(2);
      this.map.setCenter({ lat: 0, lng: 0 });
    }
  }

  clearMarkers(): void {
    this.markers.forEach(marker => {
      marker.setMap(null);
    });

    this.markers = [];

  }

  showDayMarkers(dayNumber: number): void {
    this.clearMarkers();


    this.pathPoints = [];

    console.log(this.pathPoints);
    const dayItinerary = this.itineraryResults.filter(item => item.day === dayNumber);

    // const polylineOptions = {
    //   path: [] as google.maps.LatLngLiteral[],
    //   strokeColor: 'blue',
    //   strokeOpacity: 1,
    //   strokeWeight: 1,
    //   map: this.map,
    //   icons: [{
    //     icon: {
    //       path: google.maps.SymbolPath.CIRCLE,
    //       strokeColor: 'blue',
    //       strokeOpacity: 1,
    //       scale: 3,
    //     },
    //     offset: '0',
    //     repeat: '20px'
    //   }]
    // };

    dayItinerary.forEach(item => {
      const marker = new google.maps.Marker({
        position: { lat: item.lat, lng: item.lng },
        map: this.map,
        title: item.name,
        label: {
          text: `${item.order}`,
          color: 'white',
          fontSize: '12px',
          fontWeight: 'bold'
        }
      });

      // const markerPosition = marker.getPosition();
      // if (markerPosition) {
      //   const latLngLiteral: google.maps.LatLngLiteral = {
      //     lat: markerPosition.lat(),
      //     lng: markerPosition.lng()
      //   };
      //   this.pathPoints.push(latLngLiteral);
      // }

      const infoWindowContent = `
        <div>
          <h3>${item.name}</h3>
          <h4>${item.address}</h4>
        </div>
      `;

      const infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent
      });

      marker.addListener('click', () => {
        infoWindow.open(this.map, marker);
      });

      this.markers.push(marker);
    });

    // console.log(this.pathPoints);
    // polylineOptions.path = this.pathPoints;

    // const polyline = new google.maps.Polyline(polylineOptions);

    this.selectedDay = dayNumber;
    this.fitMapToMarkers();
  }




  fitMapToMarkers() {
    const bounds = new google.maps.LatLngBounds();
    this.markers.forEach(marker => {
      bounds.extend(marker.getPosition() || { lat: 0, lng: 0 });
    });
    this.map.fitBounds(bounds);
  }

  generateSchedule() {
    this.loading = true;

    const preferences = {
      preferredLocations: this.tripSummary.selectedLocations,
      location: this.tripSummary.city,
      trip_length: this.tripSummary.tripLength,
      startDate: this.tripSummary.startDate,
      endDate: this.tripSummary.endDate,
      selectedOption: this.tripSummary.selectedOption
    };


    this.scheduleService.generateSchedule(preferences).subscribe(result => {
      this.itineraryResults = JSON.parse(result);
      console.log(this.itineraryResults);

      this.loading = false;
      this.showSchedule = true
      this.showDayMarkers(1);
      if (this.tripSummary.selectedOption == 'length') {
        const bestDay = this.tripSummary.best_start
        console.log(bestDay)
        console.log(this.getFirstFutureDate(bestDay));
      }
    },
      (error) => {
        console.error('Error generating schedule:', error);
        this.loading = false;
      }
    );

  }

  ngOnInit(): void {
    this.headerService.setShowHeader(false);
    this.tripSummary = this.addTripService.getTripSummary();
    console.log(this.tripSummary);

    if (this.tripSummary.selectedOption == 'dates') {
      const startDate = new Date(this.tripSummary.startDate);
      const endDate = new Date(this.tripSummary.endDate);
      const timeDifference = endDate.getTime() - startDate.getTime();
      this.daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
      console.log(this.daysDifference)
      this.nr_days = this.daysDifference > 1 ? 'days' : 'day';

      this.tripDays = [];
      for (let i = 0; i < this.daysDifference; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        const dayName = this.getDayName(currentDate.getDay());
        const formattedDate = this.formatDate(currentDate);
        this.tripDays.push({ dayNumber: i + 1, day: dayName, date: formattedDate, expanded: false });
      }
      console.log(this.tripDays);
    }
    else {
      //optiunea selectata = length
      if (this.tripSummary.tripLength == 1)
        this.nr_days = 'day'
    }

    const initialDayNumber = this.tripDays[0]?.dayNumber || 1;
    this.showDayMarkers(initialDayNumber);

  }
  getFirstFutureDate(dayAbbreviation: string): Date {
    const today = new Date();
    let currentDayIndex = today.getDay();

    const targetDayIndex = this.dayAbbreviationToIndex[dayAbbreviation];
    let daysToAdd = targetDayIndex - currentDayIndex;
    if (daysToAdd <= 0) {
      daysToAdd += 7;
    }

    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + daysToAdd);

    return futureDate;
  }

  goBack(): void {
    this.router.navigate(['/add-trip']);
  }

  getDayName(dayNumber: number): string {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[dayNumber];
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  filterItineraryByDay(dayNumber: number): any[] {
    return this.itineraryResults.filter(item => item.day === dayNumber);
  }

}
