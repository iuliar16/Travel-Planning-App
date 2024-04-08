import { Component, Input } from '@angular/core';
import { CdkDrag, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-itinerary-item',
  templateUrl: './itinerary-item.component.html',
  styleUrl: './itinerary-item.component.css'
})
export class ItineraryItemComponent {
  @Input() itineraryItem!: any;

  constructor() { }
  getPhotoUrl(photoReference: string): string {
    const apiKey = 'AIzaSyCbqdF-F4bLlH8giQESqHFfi0tIyTtEuPw';
    const maxWidth = 400;
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${apiKey}`;
  }
  openDirections(item: any) {

    const currentLocation = `${item.lat},${item.lng}`;
    console.log(currentLocation);

    const destination = `${item.nextItem.lat},${item.nextItem.lng}`; // Assuming nextItem contains the next itinerary item
    console.log(destination);
    const url = `https://www.google.com/maps/dir/?api=1&origin=${currentLocation}&destination=${destination}`;

    console.log(currentLocation);
    console.log(destination);
    // Open the URL in a new tab
    window.open(url, '_blank');
  }
}
