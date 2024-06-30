import { Component, ElementRef } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { StorageService } from '../services/storage/storage.service';
import { Router } from '@angular/router';
import { HeaderService } from '../services/header/header.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  message: string = '';
  keepMeSignedIn: boolean = false;
  constructor(
    private headerService: HeaderService,
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.headerService.setShowHeader(true);
    if (this.authService.isLogin()) {
      this.router.navigate(['/home']);
    }
  }
  login(formData: any, keepMeSignedIn: boolean) {
    this.message = '';

    if (!formData.email || !formData.password) {
      this.message = 'Please complete all required fields.';
      return;
    }

    this.authService.login(formData).subscribe(
      (response) => {
        if (keepMeSignedIn) {
          this.storageService.saveUserWithPersistence(response);
        } else {
          this.storageService.saveUser(response);
        }
        this.router.navigate(['/home']);
      },
      (error) => {
        this.message = 'Invalid username or password.';
      }
    );
  }

}
