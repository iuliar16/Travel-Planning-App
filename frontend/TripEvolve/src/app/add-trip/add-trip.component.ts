import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { AddTripService } from '../services/add-trip/add-trip.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-trip',
  templateUrl: './add-trip.component.html',
  styleUrl: './add-trip.component.css'
})
export class AddTripComponent {
  locations: string[] = ['Must-see Attractions', 'Museums', 'Parks', 'Zoo', 'Wellness and Spas',
    'Casino', 'Shopping Malls', 'Places of worship'];
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
    selectedOption: ''
    // city:''
  };


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

  constructor(private addTripService: AddTripService, private router: Router) { }

  onSubmit() {
    this.message = '';
    this.formData.selectedLocations = this.selectedLocations;
    this.formData.selectedOption = this.selectedOption;

    if (!(this.formData.location && this.formData.selectedLocations && (this.formData.startDate || this.formData.tripLength))) {
      this.message = 'Please complete all required fields.';
      return;
    }

    // this.cityName = this.formData.location.split(',')[0].trim();
    // console.log(this.cityName);
    console.log(this.formData);
    this.addTripService.setFormData(this.formData);

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

  toggleLocation(location: string): void {
    const index = this.selectedLocations.indexOf(location);
    if (index !== -1) {
      this.selectedLocations.splice(index, 1);
    } else {
      this.selectedLocations.push(location);
    }
  }
  selectOption(option: 'dates' | 'length') {
    this.selectedOption = option;
  }

}