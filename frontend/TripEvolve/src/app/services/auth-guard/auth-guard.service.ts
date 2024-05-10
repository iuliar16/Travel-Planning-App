import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private storageService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.storageService.isLogin()) {
      return true; 
    } else {
      this.router.navigate(['/sign-in']);
      return false;
    }
  }
}
