import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { AddTripService } from '../services/add-trip/add-trip.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { debounce } from 'lodash';
import { HeaderService } from '../services/header/header.service';
import { TripInfoService } from '../services/trip-info/trip-info.service';


@Component({
  selector: 'app-add-trip',
  templateUrl: './add-trip.component.html',
  styleUrl: './add-trip.component.css'
})
export class AddTripComponent {
  locations: string[] = ['Must-see Attractions', 'Museums', 'Parks', 'Zoo', 'Wellness and Spas',
    'Casino', 'Shopping Malls', 'Places of worship'];
  locationPreferences: Map<string, number> = new Map<string, number>();
  selectedLocations: string[] = [];
  selectedOption: 'dates' | 'length' = 'dates';
  value: number = 1;
  message: string = '';
  minEndDate: string = '';
  maxEndDate: string = '';
  endDateControl = new FormControl();

  @ViewChild('placesSearchInput', { static: false })
  placesSearchInput!: ElementRef;
  autocompleteInput!: string;

  formData = {
    tripName: '',
    location: '',
    selectedLocations: [] as string[],
    startDate: '',
    endDate: '',
    tripLength: this.value,
    selectedOption: '',
    placeName: '',
    locationPreferences: new Map<string, number>()
    // city:''
  };

  constructor(private headerService: HeaderService,
    private tripInfoService:TripInfoService,
    private addTripService: AddTripService,
     private router: Router) {
    this.initializeLocationPreferences();
  }

  ngOnInit(): void {
    this.headerService.setShowHeader(true);
  }

  startDateChanged(event: any) {
    const selectedStartDate = event.target.value;
    this.minEndDate = selectedStartDate;

    console.log(selectedStartDate);

    const maxDate = new Date(selectedStartDate);
    maxDate.setDate(maxDate.getDate() + 7);
    this.maxEndDate = maxDate.toISOString().split('T')[0];

    const selectedEndDate = this.endDateControl.value;
    if (selectedEndDate) {
      const endDate = new Date(selectedEndDate);
      if (endDate < new Date(selectedStartDate) || endDate > maxDate) {
        this.endDateControl.setValue(null);
      }
    }
    this.formData.startDate = selectedStartDate;
    this.formData.endDate = selectedEndDate;

  }

  ngAfterViewInit(): void {
    this.loadGoogleMaps(() => {
      this.initAutocomplete();
    });
  }

  loadGoogleMaps(callback: () => void) {
    const googleMapsScript = document.createElement('script');
    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCbqdF-F4bLlH8giQESqHFfi0tIyTtEuPw&libraries=places`;
    googleMapsScript.onload = callback;
    document.body.appendChild(googleMapsScript);
  }

  initAutocomplete(): void {
    const autocomplete = new google.maps.places.Autocomplete(this.placesSearchInput.nativeElement, {
      types: ['(cities)']
    });
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.formatted_address) {
        console.error('Invalid place selected');
        return;
      }
      this.autocompleteInput = place.formatted_address;
      this.formData.location = place.formatted_address;
    });
  }


  initializeLocationPreferences() {
    for (const location of this.locations) {
      this.locationPreferences.set(location, 0);
    }
  }
  onSubmit() {
    this.message = '';
    this.formData.selectedLocations = this.selectedLocations;
    this.formData.selectedOption = this.selectedOption;

    console.log(this.formData.selectedOption);
    if (this.formData.selectedOption == 'dates') {
      console.log(this.formData.startDate);
      console.log(this.formData.endDate)

      if (this.formData.startDate == '' || this.formData.endDate == '' || this.formData.startDate == null || this.formData.endDate == null) {
        this.message = 'Please complete all required fields.';
        return;
      }
    }

    if (!(this.formData.location && this.formData.selectedLocations.length)) {
      this.message = 'Please complete all required fields.';
      return;
    }


    this.formData.locationPreferences = this.locationPreferences;
    console.log(this.formData);
    this.addTripService.setFormData(this.formData);

    this.tripInfoService.submitTrip();


    this.router.navigate(['/schedule-itinerary']);

  }

  increment() {
    if (this.value < 7) {
      this.value++;
      this.formData.tripLength = this.value;
    }

  }

  decrement() {
    if (this.value > 1) {
      this.value--;
      this.formData.tripLength = this.value;
    }
  }


  isLocationSelected(location: string): boolean {
    return this.selectedLocations.includes(location);
  }

  onRangeInputDebounced = debounce((location: string, event: Event) => {
    const inputElement = event.target as HTMLInputElement;
    const percentage = parseInt(inputElement.value, 10);
    this.locationPreferences.set(location, percentage);
    this.toggleLocation(location, percentage);
    console.log(percentage);
  }, 100);


  toggleLocation(location: string, percentage: number): void {
    const index = this.selectedLocations.indexOf(location);
    if (index !== -1) {
      this.selectedLocations.splice(index, 1);
      this.locationPreferences.delete(location);
    } else {
      this.selectedLocations.push(location);
      this.locationPreferences.set(location, percentage);
    }
  }

  selectOption(option: 'dates' | 'length') {
    this.selectedOption = option;
  }

}