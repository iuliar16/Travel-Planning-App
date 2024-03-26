import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { AddTripService } from '../services/add-trip/add-trip.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-trip',
  templateUrl: './add-trip.component.html',
  styleUrl: './add-trip.component.css'
})
export class AddTripComponent {
  locations: string[] = ['Must-see Attractions', 'Museums', 'Parks', 'Zoo', 'Great Food', 'Wellness and Spas',
    'Picnic', 'Swimming Pools', 'Cinema', 'Casino', 'Shopping Malls', 'Castles', 'Places of worship', 'Outdoor Adventures'];
  selectedLocations: string[] = [];
  selectedOption: 'dates' | 'length' = 'dates';
  value: number = 1;
  message: string = '';

  formData = {
    tripName: '',
    location: '',
    selectedLocations: [] as string[],
    startDate: null,
    tripLength: this.value
  };

  constructor(private addTripService: AddTripService, private router: Router) { }

  onSubmit() {
    this.message = '';
    this.formData.selectedLocations = this.selectedLocations;
    if (!(this.formData.location && this.formData.selectedLocations && (this.formData.startDate || this.formData.tripLength))) {
      this.message = 'Please complete all required fields.';
      return;
    }

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