import { Injectable } from '@angular/core';
import { TripInfoService } from '../trip-info/trip-info.service';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TripSubmittedGuardService implements CanActivate {

  constructor(private tripService: TripInfoService, private router: Router) {}

  canActivate(): boolean {
    if (this.tripService.isTripSubmitted()) {
      return true;
    } else {
      this.router.navigate(['/add-trip']);
      return false;
    }
  }
}
