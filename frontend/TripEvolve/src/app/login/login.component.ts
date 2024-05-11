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
  constructor(
    private el: ElementRef,
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
  login(formData: any) {
    this.message = '';

    if (!formData.email || !formData.password) {
      this.message = 'Invalid username or password.';
      return;
    }

    this.authService.login(formData).subscribe(
      (response) => {
        console.log('Login successful', response);
        this.storageService.saveUser(response);
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Login failed!', error);
        this.message = 'Invalid username or password.';
      }
    );
  }

}
