import { Component, ElementRef } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { StorageService } from '../services/storage/storage.service';
import { EmailService } from '../services/email/email.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  message: string = '';
  constructor(
    private el: ElementRef,
    private authService: AuthService,
    private storageService: StorageService,
    private readonly emailService: EmailService
  ) {}
  register(formData: any) {
    console.log('submit');
    this.message = '';
    if (!formData.firstname || !formData.lastname || !formData.email || !formData.password)
     {
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
          this.emailService.sendRegistrationEmail(emailDetails).subscribe(
            (emailResponse) => {
              console.log('E-mail trimis cu succes!', emailResponse);
              this.message = 'Un email de confirmare a fost trimis la ' + formData.email;
            },
            (emailError) => {
              console.error('Eroare la trimiterea e-mailului', emailError);
            }
          );
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
