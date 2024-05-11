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

  ngOnInit(){
    if (this.authService.isLogin()) {
      this.router.navigate(['/home']);
    }
  }
  register(formData: any) {
    console.log('submit');
    this.message = '';
    if (!formData.firstname || !formData.lastname || !formData.email || !formData.password) {
      this.message = 'Toate câmpurile sunt obligatorii!';
      console.log('here1');
      console.log(this.message)
      return;
    }
    // if (formData.password !== formData.confirmPassword) {
    //   this.message = 'Parolele nu se potrivesc!';
    //   console.log('here2');
    //   return;
    // }
    if (formData.email) {
      const emailDetails = {
        recipient: formData.email,
      };

      this.authService.signup(formData).subscribe(
        (response) => {
          console.log('Register successful', response);
          console.log(emailDetails);
          this.showBtn=false;
          this.message = 'In order to complete the subscription process, simply check your inbox and click on the link in the email we have just sent you.'
        },
        (error) => {
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
