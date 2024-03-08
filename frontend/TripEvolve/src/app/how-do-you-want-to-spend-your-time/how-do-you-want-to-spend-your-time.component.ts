import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-how-do-you-want-to-spend-your-time',
  templateUrl: './how-do-you-want-to-spend-your-time.component.html',
  styleUrl: './how-do-you-want-to-spend-your-time.component.css'
})
export class HowDoYouWantToSpendYourTimeComponent {
  location: string = '';
  constructor(private router: Router) { }
  goBack() {
    this.router.navigate(['/addTrip-dates']);
  }
  submit() {
    
  }
}
