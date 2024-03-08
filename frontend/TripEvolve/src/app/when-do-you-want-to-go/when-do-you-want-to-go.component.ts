import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-when-do-you-want-to-go',
  templateUrl: './when-do-you-want-to-go.component.html',
  styleUrl: './when-do-you-want-to-go.component.css'
})
export class WhenDoYouWantToGoComponent {
  location: string='';
  constructor(private router: Router) { }

  goBack(){
    this.router.navigate(['/addTrip-location']);
  }
  goToNextQuestion() {
    this.router.navigate(['/addTrip-spendtime']);
  }
}
