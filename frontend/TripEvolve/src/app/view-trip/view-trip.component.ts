import { Component, ElementRef, ViewChild } from '@angular/core';
import { HeaderService } from '../services/header/header.service';
import { SaveItineraryService } from '../services/save-itinerary/save-itinerary.service';
import { ScheduleService } from '../services/generate-itinerary/schedule-itinerary.service';
import { AddTripService } from '../services/add-trip/add-trip.service';
import { StorageService } from '../services/storage/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TripInfoService } from '../services/trip-info/trip-info.service';
import { } from 'googlemaps';


@Component({
  selector: 'app-view-trip',
  templateUrl: './view-trip.component.html',
  styleUrl: './view-trip.component.css'
})
export class ViewTripComponent {
  selectedDay: number | null = null;
  id: number = 0;
  tripInfo: any[] = [];
  tripDetails: any[] = [];
  tripDays: any[] = [];
  tripPhoto: string = ''
  showMoreOptions: boolean = false;

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

  constructor(private saveItineraryService: SaveItineraryService,
    private storageService: StorageService, private route: ActivatedRoute,
    private router: Router, private headerService: HeaderService,
    private tripInfoService: TripInfoService
  ) { }


  goBack(): void {
    this.router.navigate(['/home']);
  }

  toggleMoreOptions() {
    this.showMoreOptions = !this.showMoreOptions;
  }
  getPhotoUrl(photoReference: string): string {
    const apiKey = 'AIzaSyCbqdF-F4bLlH8giQESqHFfi0tIyTtEuPw';
    const maxWidth = 400;
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${apiKey}`;

  }
  getItineraryPhotoUrl(): string {
    if (this.tripInfo[0].photo) {
      this.tripPhoto = this.getPhotoUrl(this.tripInfo[0].photo);
      return this.tripPhoto;
    }
    return './assets/images/rome.jpg';
  }
  getDayName(dayNumber: number): string {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[dayNumber];
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }


  ngOnInit(): void {
    this.headerService.setShowHeader(false);
    this.id = this.route.snapshot.queryParams['id'];
    this.tripDetails = this.tripInfoService.getTripInfo();

    console.log(this.tripDetails);
    this.tripDetails.forEach((item: any) => {
      if (item.itinerary_id == this.id) {
        console.log('Found itinerary:', item);
        let start = new Date(item.startDate);

        this.tripDays = [];
        let durata = item.tripLength;
        for (let i = 0; i < durata; i++) {
          const currentDate = new Date(start);
          currentDate.setDate(start.getDate() + i);
          const dayName = this.getDayName(currentDate.getDay());
          const formattedDate = this.formatDate(currentDate);
          this.tripDays.push({ dayNumber: i + 1, day: dayName, date: formattedDate, expanded: false });
        }
        console.log(this.tripDays);
      }
    });


    this.saveItineraryService.getTripInfo(this.id).subscribe(
      (response: any[]) => {
        this.tripInfo = response;
        console.log(response);

        this.tripInfo.forEach(location => {
          this.saveItineraryService.getLocationInfo(location.location_id)
            .subscribe(
              (response: any) => {
                console.log(response);

                location.name = response.name;
                location.address = response.address;
                location.city = response.city;
                location.lat = response.lat;
                location.lng = response.lng;
                location.type = response.type;
                location.photo = response.photo;
              
              },
              error => {
                console.error('Error fetching location data', error);
              }
            );
        });
        setTimeout(() => {
          this.showDayMarkers(1);
        }, 5000);
      },
      error => {
        console.error('Error fetching saved trips:', error);
      }
    );

  }
  filterItineraryByDay(dayNumber: number): any[] {
    return this.tripInfo.filter(item => item.visit_day === dayNumber);
  }
  ngAfterViewInit(): void {
    this.mapInitializer();
    // this.showDayMarkers(1);
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
  toggleDay(day: any) {
    day.expanded = !day.expanded;
    console.log(day.expanded)
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
    const currentIndex = this.tripInfo.findIndex(item => item === currentItem);
    return this.tripInfo[currentIndex + 1];
  }

  showDayMarkers(dayNumber: number): void {
    this.clearMarkers();
    this.clearPaths();

    this.pathPoints = [];

    const dayItinerary = this.tripInfo.filter(item => item.visit_day === dayNumber);

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

    console.log("item")
    console.log(parseFloat(origin.lat))
    console.log(parseFloat(origin.lng))

    console.log("nextItem")
    console.log(parseFloat(destination.lat))
    console.log(parseFloat(destination.lng))
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

}
