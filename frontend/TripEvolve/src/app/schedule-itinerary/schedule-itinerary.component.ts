import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ScheduleService } from '../services/generate-itinerary/schedule-itinerary.service';
import { } from 'googlemaps';
import { HeaderService } from '../services/header/header.service';
import { Router } from '@angular/router';
import { AddTripService } from '../services/add-trip/add-trip.service';
import { jsPDF } from 'jspdf';
import { SaveItineraryService } from '../services/save-itinerary/save-itinerary.service';
import { StorageService } from '../services/storage/storage.service';
import { TripInfoService } from '../services/trip-info/trip-info.service';

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
  locationPreferences: Map<string, number> = new Map<string, number>();
  nr_days: string = 'days'
  itineraryResults: any[] = [];
  daysDifference: number = 1;
  tripDays: any[] = [];
  tripSummary: any = {};
  showSchedule: boolean = false;
  loading: boolean = false;
  selectedDay: number | null = null;
  cityName: string = '';
  showMoreOptions: boolean = false;
  tripPhoto: string = ''
  duration:number = 1

  toggleMoreOptions() {
    this.showMoreOptions = !this.showMoreOptions;
  }

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
  directionsService: any;
  directionsRenderer: any;
  paths: google.maps.Polyline[] = [];
  isLoggedIn: boolean;
  utilizator = {
    id_user: 'id_user',
    username: 'username',
    firstname: 'Prenume',
    lastname: 'Nume',
    email: 'email@example.com',
  };


  constructor(private router: Router, private scheduleService: ScheduleService,
    private headerService: HeaderService, private addTripService: AddTripService,
    private saveItineraryService: SaveItineraryService, private storageService: StorageService,
    private tripInfoService: TripInfoService,
  ) {
    this.isLoggedIn = this.storageService.isLoggedIn();
    this.tripSummary = this.addTripService.getTripSummary();
  }
  saveTrip() {
    this.utilizator = this.storageService.getUser()
    if (this.tripSummary.selectedOption == 'dates')
      {
        const startDate = new Date(this.tripSummary.startDate);
        const endDate = new Date(this.tripSummary.endDate);
        const timeDifference = endDate.getTime() - startDate.getTime();
        this.duration = Math.ceil(timeDifference / (1000 * 3600 * 24)) +1;
      }
      else
      {
        this.duration = this.tripSummary.tripLength
      }
    const itineraryData = {
      user_id: this.utilizator.id_user,
      title: this.tripSummary.tripName,
      startDate: this.tripSummary.startDate,
      endDate: this.tripSummary.endDate,
      city: this.tripSummary.city,
      tripLength: this.duration,
      photo: this.tripPhoto
    };

    console.log(itineraryData)

    this.saveItineraryService.saveItinerary(itineraryData)
      .subscribe(
        response => {
          const itinerary_id = response.itinerary_id
          console.log('Itinerary saved successfully:', response);
           
          this.itineraryResults.forEach(location => {
            const locationData = {
              name: location.name,
              lat: location.lat,
              lng: location.lng,
              type: location.type,
              city: this.tripSummary.city,
              address: location.address,
              photo: location.photo[0].photo_reference,
              tripDays:this.tripDays

            }
            console.log(locationData);
            this.saveItineraryService.saveLocation(locationData)
              .subscribe(
                response => {
                  const location_id = response.location_id;
                  console.log('Location saved successfully:', response);

                  const itineraryLocationData = {
                    itinerary_id: itinerary_id,
                    location_id: location_id,
                    visit_order: location.order,
                    visit_day: location.day,
                    arrival_hour: location.arrival_hour,
                    leave_hour: location.leave_hour,
                    tripDays:this.tripDays
                  };
                  this.saveItineraryService.saveItineraryLocations(itineraryLocationData).subscribe(
                    itineraryLocationResponse => {
                      console.log('ItineraryLocations saved successfully:', itineraryLocationResponse);
                    },
                    error => {
                      console.error('Error saving ItineraryLocations:', error);
                    }
                  );
                },
                error => {
                  console.error('Error saving Location:', error);
                }
              );
          });
        },
        error => {
          console.error('Error saving trip:', error);
        }
      );
  }

  toggleDay(day: any) {
    day.expanded = !day.expanded;
    console.log(day.expanded)
  }

  ngAfterViewInit(): void {
    this.mapInitializer();
  }

  mapInitializer() {
    if (typeof google !== 'undefined') {
      if (this.gmap) {
        this.map = new google.maps.Map(this.gmap.nativeElement);
        this.map.setZoom(2);
        this.map.setCenter({ lat: 0, lng: 0 });
      }
      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer();
      this.directionsRenderer.setMap(this.map);
    } else {
      console.error('Google Maps API is not loaded.');
    }
  }


  clearMarkers(): void {
    this.markers.forEach(marker => {
      marker.setMap(null);
    });

    this.markers = [];

  }
  getPhotoUrl(photoReference: string): string {
    const apiKey = 'AIzaSyCbqdF-F4bLlH8giQESqHFfi0tIyTtEuPw';
    const maxWidth = 400;
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${apiKey}`;

  }
  getItineraryPhotoUrl(): string {
    if (this.itineraryResults[0].photo[0].photo_reference) {
      this.tripPhoto = this.getPhotoUrl(this.itineraryResults[0].photo[0].photo_reference);
      return this.tripPhoto;
    }
    return './assets/images/rome.jpg';
  }

  openDirections(startLocation: any, endLocation: any): void {
    const startLat = startLocation.lat;
    const startLng = startLocation.lng;
    const endLat = endLocation.lat;
    const endLng = endLocation.lng;

    const url = `https://www.google.com/maps/dir/?api=1&origin=${startLat},${startLng}&destination=${endLat},${endLng}&travelmode=walking`;
    window.open(url, '_blank');
  }

  getNextItineraryItem(currentItem: any): any {
    const currentIndex = this.itineraryResults.findIndex(item => item === currentItem);
    return this.itineraryResults[currentIndex + 1];
  }

  showDayMarkers(dayNumber: number): void {
    this.clearMarkers();
    this.clearPaths();

    this.pathPoints = [];

    const dayItinerary = this.itineraryResults.filter(item => item.day === dayNumber);

    dayItinerary.forEach((item, index) => {
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
      if (index < dayItinerary.length - 1) {
        const nextItem = dayItinerary[index + 1];
        this.calculateAndDisplayRoute(item, nextItem);
      }

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


    this.selectedDay = dayNumber;
    this.fitMapToMarkers();
  }

  calculateAndDisplayRoute(origin: any, destination: any): void {
    var circle = {
      path: google.maps.SymbolPath.CIRCLE,
      strokeOpacity: 1,
      fillOpacity: 1,
      scale: 3
    };
    
    this.directionsService.route(
      {
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: destination.lat, lng: destination.lng },
        travelMode: google.maps.TravelMode.WALKING,
      },
      (response: any, status: any) => {
        if (status === 'OK') {
          const path = new google.maps.Polyline({
            icons: [{
              icon: circle,
              offset: '0',
              repeat: '20px'
            }],
            path: response.routes[0].overview_path,
            geodesic: true,
            strokeColor: '#0000FF',
            strokeOpacity: 0,
            strokeWeight: 2,
          });
          path.setMap(this.map);

          this.paths.push(path);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      }
    );
  }
  clearPaths(): void {
    this.paths.forEach(path => {
      path.setMap(null);
    });
    this.paths = [];
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

    const convMap: { [key: string]: number } = {};
    this.tripSummary.locationPreferences.forEach((val: number, key: string) => {
      convMap[key] = val;
    });
    const preferences = {
      preferredLocations: this.tripSummary.selectedLocations,
      location: this.tripSummary.city,
      trip_length: this.tripSummary.tripLength + 1,
      startDate: this.tripSummary.startDate,
      endDate: this.tripSummary.endDate,
      selectedOption: this.tripSummary.selectedOption,
      placeName: this.tripSummary.placeName,
      locationPreferences: convMap
    };


    this.scheduleService.generateSchedule(preferences).subscribe(result => {
      this.itineraryResults = JSON.parse(result);
      console.log(this.itineraryResults);

      this.loading = false;
      this.showSchedule = true
      this.showDayMarkers(1);
      if (this.tripSummary.selectedOption == 'length') {
        const bestDay = this.itineraryResults[0].best_start;
        console.log(bestDay)
        console.log(this.getFirstFutureDate(bestDay));
        const start = this.getFirstFutureDate(bestDay)

        this.tripDays = [];
        let durata = this.tripSummary.tripLength;
        for (let i = 0; i < durata; i++) {
          const currentDate = new Date(start);
          currentDate.setDate(start.getDate() + i);
          const dayName = this.getDayName(currentDate.getDay());
          const formattedDate = this.formatDate(currentDate);
          this.tripDays.push({ dayNumber: i + 1, day: dayName, date: formattedDate, expanded: false });
        }
        console.log(this.tripDays);
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
      this.daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24)) + 1;
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
      if (this.tripSummary.tripLength == 1)
        this.nr_days = 'day'
      else
        this.nr_days = 'days'
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

  generatePdf(): void {
    const pdfContent = this.generatePdfContent();

    const pdf = new jsPDF();

    pdf.html(pdfContent, {
      callback: (pdf) => {
        pdf.save('trip_itinerary.pdf');
      }
    });
  }

  generatePdfContent(): string {
    let htmlContent = '<h4>Trip Itinerary</h4>';

    htmlContent += `<h6>${this.tripSummary.city} (${this.tripSummary.tripLength} ${this.nr_days})</h6>`;
    this.tripDays.forEach((day) => {
      htmlContent += `<h6>${day.day}, ${day.date}</h6>`;
      const dayItinerary = this.filterItineraryByDay(day.dayNumber);
      dayItinerary.forEach((item) => {
        htmlContent += `
          <div>
            <p>${item.order}. ${item.name}</p>
            <p>${item.address}</p>
            <p>Arrival: ${item.arrival_hour} - Departure: ${item.leave_hour}</p>
            <p>Type: ${item.type === 'tourism_attraction' ? 'Must-see' : item.type}</p>
          </div>
        `;
      });
    });

    return htmlContent;
  }


}
