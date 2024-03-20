import { Component } from '@angular/core';
import { HeaderService } from './services/header/header.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TripEvolve';
  constructor(public headerService: HeaderService) {} 
}
