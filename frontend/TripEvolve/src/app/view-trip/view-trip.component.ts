import { Component, ElementRef, ViewChild } from '@angular/core';
import { HeaderService } from '../services/header/header.service';
import { SaveItineraryService } from '../services/save-itinerary/save-itinerary.service';
import { StorageService } from '../services/storage/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TripInfoService } from '../services/trip-info/trip-info.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Clipboard } from '@angular/cdk/clipboard';
import { AuthService } from '../services/auth/auth.service';


@Component({
  selector: 'app-view-trip',
  templateUrl: './view-trip.component.html',
  styleUrl: './view-trip.component.css'
})
export class ViewTripComponent {
  selectedDay: number | null = null;
  shareableLink: string = '';
  id: number = 0;
  tripInfo: any[] = [];
  tripDetails: any[] = [];
  tripDays: any[] = [];
  tripPhoto: string = ''
  showMoreOptions: boolean = false;
  nr_days: string = 'days'
  openLinkTab: boolean = false;
  isLinkShared: boolean = false;
  legendItems: { day: string, color: string }[] = [];
  itineraryPhotoURL: string ='';

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
  dataLoaded: boolean = false;
  tripExists: boolean = true;
  gasit: boolean = false;
  itinerary: any = '';
  loggedIn: boolean = false;
  linkCopied: boolean = false;
  err:boolean=false;
  isLoading: boolean = false;
  userIdShared:number=-10;
  name:string='';

  constructor(private saveItineraryService: SaveItineraryService,
    private storageService: StorageService, private route: ActivatedRoute,
    private router: Router, private headerService: HeaderService,
    private tripInfoService: TripInfoService, 
    private authService: AuthService,
    private clipboard: Clipboard
  ) {
    this.loggedIn = this.storageService.isLoggedIn();


  }


  copyLink() {
    this.clipboard.copy(this.shareableLink);
    this.linkCopied = true;
    setTimeout(() => {
      this.linkCopied = false;
    }, 1000);
  }
  shareTrip(tripId: number) {
    this.saveItineraryService.generateShareableLink(tripId)
      .subscribe(response => {
        this.shareableLink = response;
        this.openLinkTab = !this.openLinkTab;

      }, error => {
        console.error('Error generating link:', error);
      });
  }


  goBack(): void {
    this.router.navigate(['/home']);
  }

  toggleMoreOptions() {
    this.showMoreOptions = !this.showMoreOptions;
    if (this.showMoreOptions === false) this.openLinkTab = false;
  }
  getPhotoUrl(photoReference: string): string {
    const apiKey = 'AIzaSyCbqdF-F4bLlH8giQESqHFfi0tIyTtEuPw';
    const maxWidth = 400;
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${apiKey}`;

  }
  getItineraryPhotoUrl(): string {
    return this.itineraryPhotoURL;
  }
  getDayName(dayNumber: number): string {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[dayNumber];
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }


  fetchAllSavedTrips(): void {
    this.saveItineraryService.getAllSavedTrips()
      .subscribe(
        (response: any[]) => {
          this.tripInfoService.setTripInfo(response);
          this.dataLoaded = true;

          this.initAfterDataLoaded();
        },
        error => {
          console.error('Error fetching saved trips:', error);
        }
      );
  }

  idEquals(id:number):boolean{
    if (this.storageService.getUser().id_user == id)
      return true;
    return false;
  }
  fetchSavedTrips(): void {
    this.saveItineraryService.getSavedTrips(this.storageService.getUser().id_user)
      .subscribe(
        (response: any[]) => {
          this.tripInfoService.setTripInfo(response);
          this.dataLoaded = true;

          this.initAfterDataLoaded();
        },
        error => {
          console.error('Error fetching saved trips:', error);
          this.err=true;
        }
      );
  }
  formatTime(timeString: string): string {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  }

  ngOnInit(): void {
    if (!(this.loggedIn || this.tripExists))
      this.headerService.setShowHeader(true);
    else
      this.headerService.setShowHeader(false);

    this.id = this.route.snapshot.queryParams['id'];
    if (!this.id) {
      this.route.params.subscribe(params => {
        const tripId = params['id'];
        if (tripId) {
          this.isLinkShared = true;
          this.loadTripByShareableLink(tripId);

        }
      });
    }

    if (!this.tripInfoService.getTripInfo()) //s-a dat refresh sau s-a cautat id-ul
    {
      if (this.id) // se cauta ?id=.. (cautam doar in trip-urile userului logat)
        this.fetchSavedTrips();
      else
      {
        this.fetchAllSavedTrips(); // shared trip
      }
    }
    else {
      this.initAfterDataLoaded(); //am ajuns in view-trip din home
    }
  }

  getUserInfoShared(id:number): any{
    this.authService.getUser(id)
    .subscribe(user => {
      this.name= user.firstname +' '+ user.lastname
    }, error => {
      console.error('Error fetching trip by shareable link:', error);
    });
  }
  loadTripByShareableLink(tripId: string) {
    this.saveItineraryService.getItineraryByShareableLink(tripId)
      .subscribe(trip => {
        this.userIdShared=trip.user_id;
        this.getUserInfoShared(this.userIdShared);
        this.id = trip.itinerary_id;
        this.tripExists = true;
      }, error => {
        console.error('Error fetching trip by shareable link:', error);
      });
  }

  generatePdf(): void {
    this.isLoading = true;
    const pdf = new jsPDF();
    
    let completedDays = 0;
  

    this.tripDays.forEach((day, index) => {
      day.expanded = true;
      
      setTimeout(() => {
        const elem: any = document.getElementById(`day-${day.dayNumber}-content`);
        
        html2canvas(elem, { scale: 2 }).then((canvas) => {
          if (index !== 0) {
            pdf.addPage();
          }
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297); 

          completedDays++;

          if (completedDays === this.tripDays.length) {
            pdf.save('trip-itinerary-to-'+this.itinerary.city+'.pdf');
            this.isLoading = false;
          }
        });
      }, 1000);
    });
  }
  


  initAfterDataLoaded(): void {
    this.tripDetails = this.tripInfoService.getTripInfo();

    this.tripDetails.forEach((item: any) => {
      if (item.itinerary_id == this.id) {
        this.itinerary = item;
        this.itineraryPhotoURL=item.photo;
        this.gasit = true;
        this.tripExists = true;
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
      }
    });
    // if(this.isLinkShared == false)
    if (this.gasit == false) {
      this.headerService.setShowHeader(true);
      this.tripExists = false;
    }

    this.saveItineraryService.getTripInfo(this.id).subscribe(
      (response: any[]) => {
        this.tripInfo = response;

        this.tripInfo.forEach(location => {
          this.saveItineraryService.getLocationInfo(location.location_id)
            .subscribe(
              (response: any) => {

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
          this.displayAllLocationsAndRoutes();
        }, 1000);
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

    const dayItinerary = this.tripInfo.filter(item => item.visit_day === currentItem.visit_day);
    const currentIndex = dayItinerary.findIndex(item => item === currentItem);
    return dayItinerary[currentIndex + 1];
  }

  markerColors = ['grey', 'red', 'blue', 'green', 'pink', 'purple', 'orange'];
  displayAllLocationsAndRoutes(): void {
    this.selectedDay = 10;
    this.clearMarkers();
    this.clearPaths();

    this.legendItems = [];
    const uniqueDays = new Set<number>();
    this.tripInfo.forEach((item, index) => {
      const markerColor = this.markerColors[item.visit_day % this.markerColors.length];

      if (!uniqueDays.has(item.visit_day)) {
        uniqueDays.add(item.visit_day);
        this.legendItems.push({ day: `Day ${item.visit_day}`, color: markerColor });
      }

      let url = "https://maps.google.com/mapfiles/ms/icons/";
      url += markerColor + ".png";
      const marker = new google.maps.Marker({
        position: { lat: item.lat, lng: item.lng },
        map: this.map,
        title: item.name,
        label: {
          text: `${item.visit_order}`,
          color: 'black',
          fontSize: '12px',
          fontWeight: 'bold'
        },
        icon: {
          url: url,
          scaledSize: new google.maps.Size(40, 40)
        }
      });
      if (index < this.tripInfo.length - 1) {
        const nextItem = this.tripInfo[index + 1];
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

    this.fitMapToMarkers();
  }


  showDayMarkers(dayNumber: number): void {
    this.clearMarkers();
    this.clearPaths();

    this.pathPoints = [];

    const dayItinerary = this.tripInfo.filter(item => item.visit_day === dayNumber);

    dayItinerary.forEach((item, index) => {
      const markerColor = this.markerColors[item.visit_day % this.markerColors.length];
      let url = "https://maps.google.com/mapfiles/ms/icons/";
      url += markerColor + ".png";
      const marker = new google.maps.Marker({
        position: { lat: item.lat, lng: item.lng },
        map: this.map,
        title: item.name,
        label: {
          text: `${item.visit_order}`,
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

}
