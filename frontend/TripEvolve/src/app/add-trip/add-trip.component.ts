import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-add-trip',
  templateUrl: './add-trip.component.html',
  styleUrl: './add-trip.component.css'
})
export class AddTripComponent {
  locations: string[] = ['Must-see Attractions', 'Museums', 'Parks', 'Zoo', 'Great Food','Wellness and Spas',
'Picnic', 'Swimming Pools','Cinema','Casino','Shopping Malls','Castles', 'Places of worship','Outdoor Adventures'];
  selectedLocations: string[] = [];

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
}