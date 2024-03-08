import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-where-are-you-travelling',
  templateUrl: './where-are-you-travelling.component.html',
  styleUrl: './where-are-you-travelling.component.css'
})

export class WhereAreYouTravellingComponent {
  location: string='';
  constructor(private router: Router) { }

  goToNextQuestion() {
    this.router.navigate(['/addTrip-dates']);
  }
}
