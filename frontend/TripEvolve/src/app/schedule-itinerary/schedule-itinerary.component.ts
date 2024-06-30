import { Component, AfterViewInit, ViewChild, ElementRef, OnInit, HostListener } from '@angular/core';
import { ScheduleService } from '../services/generate-itinerary/schedule-itinerary.service';
import { } from 'googlemaps';
import { HeaderService } from '../services/header/header.service';
import { Router } from '@angular/router';
import { AddTripService } from '../services/add-trip/add-trip.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { SaveItineraryService } from '../services/save-itinerary/save-itinerary.service';
import { StorageService } from '../services/storage/storage.service';
import { TripInfoService } from '../services/trip-info/trip-info.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import moment from 'moment';
interface DayAbbreviationMap {
  [key: string]: number;
}
@Component({
  selector: 'app-schedule-itinerary',
  templateUrl: './schedule-itinerary.component.html',
  styleUrl: './schedule-itinerary.component.css'
})

export class ScheduleItineraryComponent implements AfterViewInit, OnInit {
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
  duration: number = 1
  tripSaved: boolean = false;
  error: boolean = false;

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
  legendItems: { day: string, color: string }[] = [];
  isLoading: boolean = false;
  showPopup: boolean = false;

  constructor(private router: Router, private scheduleService: ScheduleService,
    private headerService: HeaderService, private addTripService: AddTripService,
    private saveItineraryService: SaveItineraryService, private storageService: StorageService,
    private tripInfoService: TripInfoService, private snackBar: MatSnackBar
  ) {
    this.isLoggedIn = this.storageService.isLoggedIn();
    this.tripSummary = this.addTripService.getTripSummary();
  }


  saveTrip() {
    if (this.tripSaved) {
      // If trip is already saved, do nothing
      return;
    }

    this.utilizator = this.storageService.getUser()
    if (this.tripSummary.selectedOption == 'dates') {
      const startDate = new Date(this.tripSummary.startDate);
      const endDate = new Date(this.tripSummary.endDate);
      const timeDifference = endDate.getTime() - startDate.getTime();
      this.duration = Math.ceil(timeDifference / (1000 * 3600 * 24)) + 1;
    }
    else {
      this.duration = this.tripSummary.tripLength
      const year = new Date().getFullYear();

      let startDate = moment(`${this.tripDays[0].date} ${year}`, 'MMMM DD YYYY').format('YYYY-MM-DD');
      this.tripSummary.startDate = startDate;

      let endDate = moment(`${this.tripDays[this.tripDays.length - 1].date} ${year}`, 'MMMM DD YYYY').format('YYYY-MM-DD');
      this.tripSummary.endDate = endDate;
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

    this.saveItineraryService.saveItinerary(itineraryData)
      .subscribe(
        response => {
          const itinerary_id = response.itinerary_id

          this.itineraryResults.forEach(location => {
            const locationData = {
              name: location.name,
              lat: location.lat,
              lng: location.lng,
              type: location.type,
              city: this.tripSummary.city,
              address: location.address,
              photo: location.photo[0].photo_reference,
              tripDays: this.tripDays

            }

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
                    tripDays: this.tripDays
                  };
                  this.saveItineraryService.saveItineraryLocations(itineraryLocationData).subscribe(
                    itineraryLocationResponse => {
                      console.log('ItineraryLocations saved successfully:', itineraryLocationResponse);
                      this.showPopup = true;
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
          this.tripSaved = true;
        },
        error => {
          console.error('Error saving trip:', error);
        }
      );
    setTimeout(() => {
      this.showPopup = false;
    }, 3000);
  }

  toggleDay(day: any) {
    day.expanded = !day.expanded;
  }

  ngAfterViewInit(): void {
    this.mapInitializer();
  }
  formatNiceDate(dateString: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return '';
    }
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();

    const formattedMonth = month < 10 ? '0' + month : month;
    const formattedDay = day < 10 ? '0' + day : day;

    return `${formattedMonth}/${formattedDay}/${year}`;
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
    let i = 0
    while (this.itineraryResults[i].photo) {
      this.tripPhoto = this.getPhotoUrl(this.itineraryResults[0].photo[0].photo_reference);
      i++;
      if (this.tripPhoto)
        break;
    }
    return this.tripPhoto;
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
      const markerColor = this.markerColors[item.day % this.markerColors.length];

      let url = "https://maps.google.com/mapfiles/ms/icons/";
      url += markerColor + ".png";
      const marker = new google.maps.Marker({
        position: { lat: item.lat, lng: item.lng },
        map: this.map,
        title: item.name,
        label: {
          text: `${item.order}`,
          color: 'white',
          fontSize: '12px',
          fontWeight: 'bold'
        },
        icon: {
          url: url,
          scaledSize: new google.maps.Size(40, 40)
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

  markerColors = ['grey', 'red', 'blue', 'green', 'pink', 'purple', 'orange'];
  displayAllLocationsAndRoutes(): void {
    this.selectedDay = 10;
    this.clearMarkers();
    this.clearPaths();

    this.legendItems = [];
    const uniqueDays = new Set<number>();
    this.itineraryResults.forEach((item, index) => {
      const markerColor = this.markerColors[item.day % this.markerColors.length];

      if (!uniqueDays.has(item.day)) {
        uniqueDays.add(item.day);
        this.legendItems.push({ day: `Day ${item.day}`, color: markerColor });
      }

      let url = "https://maps.google.com/mapfiles/ms/icons/";
      url += markerColor + ".png";
      const marker = new google.maps.Marker({
        position: { lat: item.lat, lng: item.lng },
        map: this.map,
        title: item.name,
        label: {
          text: `${item.order}`,
          color: 'black',
          fontSize: '12px',
          fontWeight: 'bold'
        },
        icon: {
          url: url,
          scaledSize: new google.maps.Size(40, 40)
        }
      });
      if (index < this.itineraryResults.length - 1) {
        const nextItem = this.itineraryResults[index + 1];
        if (item.day === nextItem.day) {
          this.calculateAndDisplayRoute(item, nextItem);
        }
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

    this.fitMapToMarkers();
  }


  calculateAndDisplayRoute(origin: any, destination: any): void {
    var circle = {
      path: google.maps.SymbolPath.CIRCLE,
      strokeOpacity: 1,
      fillOpacity: 1,
      scale: 2
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
          console.error('Directions request failed due to ' + status);
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
      trip_length: this.tripSummary.tripLength,
      startDate: this.tripSummary.startDate,
      endDate: this.tripSummary.endDate,
      selectedOption: this.tripSummary.selectedOption,
      placeName: this.tripSummary.placeName,
      locationPreferences: convMap
    };


    this.scheduleService.generateSchedule(preferences).subscribe(
      result => {
        try {
          this.itineraryResults = JSON.parse(result);

          this.loading = false;
          this.showSchedule = true;
          // this.showDayMarkers(1);
          this.displayAllLocationsAndRoutes();

          if (this.tripSummary.selectedOption == 'length') {
            const bestDay = this.itineraryResults[0].best_start;
     
            const start = this.getFirstFutureDate(bestDay);

            this.tripDays = [];
            let durata = this.tripSummary.tripLength;
            for (let i = 0; i < durata; i++) {
              const currentDate = new Date(start);
              currentDate.setDate(start.getDate() + i);
              const dayName = this.getDayName(currentDate.getDay());
              const formattedDate = this.formatDate(currentDate);
              this.tripDays.push({ dayNumber: i + 1, day: dayName, date: formattedDate, expanded: false });
            }
          }
        } catch (error) {
          this.error = true;
          this.headerService.setShowHeader(true);
          console.error('Error parsing JSON response:', error);
        }
      },
      error => {
        this.error = true;
        console.error('Error generating schedule:', error);
        this.loading = false;
      }
    );
  }

  ngOnInit(): void {
    this.headerService.setShowHeader(false);
    this.tripSummary = this.addTripService.getTripSummary();

    if (this.tripSummary.selectedOption == 'dates') {
      const startDate = new Date(this.tripSummary.startDate);
      const endDate = new Date(this.tripSummary.endDate);
      const timeDifference = endDate.getTime() - startDate.getTime();
      this.daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24)) + 1;
      this.tripSummary.tripLength = this.daysDifference;
      this.nr_days = this.daysDifference > 1 ? 'days' : 'day';

      this.tripDays = [];
      for (let i = 0; i < this.daysDifference; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        const dayName = this.getDayName(currentDate.getDay());
        const formattedDate = this.formatDate(currentDate);
        this.tripDays.push({ dayNumber: i + 1, day: dayName, date: formattedDate, expanded: false });
      }
    }
    else {
      if (this.tripSummary.tripLength == 1)
        this.nr_days = 'day'
      else
        this.nr_days = 'days'
    }

    const initialDayNumber = this.tripDays[0]?.dayNumber || 1;
    // this.showDayMarkers(initialDayNumber);

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
    this.isLoading = true;

    this.tripDays.forEach(day => {
      day.expanded = true;
    });

    setTimeout(() => {
      const elem: any = document.getElementById('allDaysContent');
      const tripInfoElem: string = this.tripSummary.city

      html2canvas(elem, { scale: 2 }).then((canvas) => {
        const pdf = new jsPDF();
        const name = `Trip to ` + tripInfoElem;

        pdf.addImage(canvas.toDataURL('/image/png'), 'PNG', 0, -40, 101, 298);

        pdf.setProperties({
          title: name,
          subject: name,
          author: 'tripEvolve',
        });
        pdf.setFontSize(12);
        pdf.save(name);
        this.isLoading = false;


      });
    }, 1000);
  }



}
