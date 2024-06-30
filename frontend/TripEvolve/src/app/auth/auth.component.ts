import { Component, ElementRef } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { StorageService } from '../services/storage/storage.service';
import { EmailService } from '../services/email/email.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  message: string = '';
  showBtn: boolean = true;
  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.authService.isLogin()) {
      this.router.navigate(['/home']);
    }
  }
  register(formData: any) {
    this.message = '';
    if (!formData.firstname || !formData.lastname || !formData.email || !formData.password) {
      this.message = 'Please complete all required fields.';
      return;
    }

    if (formData.email) {
      const emailDetails = {
        recipient: formData.email,
      };

      this.authService.signup(formData).subscribe(
        (response) => {
          this.showBtn = false;
          this.message = 'In order to complete the subscription process, simply check your inbox and click on the link in the email we have just sent you.'
        },
        (error) => {
          if (error.status === 409) {
            this.message = 'This email is already in use. Please use another one.';
        } else if (error.status === 400 && error.error.message === 'Password is not strong enough') {
            this.message = 'The password is not strong enough. Please ensure it has at least 8 characters, including upper and lower case letters, and digits.';
        } else if (error.status === 400 && error.error.message === 'Invalid email format') {
            this.message = 'The email format is invalid. Please enter a valid email address.';
        } else if (error.error && error.error.message === 'Error sending confirmation email.') {
            this.message = 'There was an error sending the confirmation email. Please try again later.';
        } else {
            this.message = 'An unexpected error occurred. Please try again later.';
        }
          console.error('Register failed!', error);
        }
      );
    } else {
      console.error('Adresa de email lipseste in formData!');
    }
  }

  isLoggedIn(): boolean {
    return this.storageService.isLoggedIn();
  }

}
