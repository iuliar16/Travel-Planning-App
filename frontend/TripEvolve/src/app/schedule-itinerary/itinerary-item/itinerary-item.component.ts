import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-itinerary-item',
  templateUrl: './itinerary-item.component.html',
  styleUrl: './itinerary-item.component.css'
})
export class ItineraryItemComponent {
  @Input() itineraryItem!: any;

  getPhotoUrl(photoReference: string): string {
    const apiKey = 'AIzaSyCbqdF-F4bLlH8giQESqHFfi0tIyTtEuPw';
    const maxWidth = 400;
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${apiKey}`;
  }
}
