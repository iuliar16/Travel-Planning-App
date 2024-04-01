import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrl: './forgot-pass.component.css'
})
export class ForgotPassComponent {
  formGroup: FormGroup = new FormGroup({});
  email: FormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  isSent: boolean = false;
  timer: any;
  message: string='';

  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit() {
    this.formGroup = new FormGroup({
      email: this.email,
    });
  }

  submitForm_reset() {
    if (this.formGroup.valid) {
      console.log(this.formGroup.value);

      this.auth.forgotPassword(this.formGroup.value.email).subscribe(
        (response) => {
          console.log('Mail sent', response);
          // Show "Sent" text on the button
          this.isSent = true;
          this.message="We've just sent you an email to reset your password."
          // Reset the button after 5 seconds
          this.timer = setTimeout(() => {
            this.isSent = false;
          }, 5000);
        },
        (error) => {
          console.error('Mail failed!', error);
          // Handle error and clear the timer
          this.isSent = false;
          clearTimeout(this.timer);
          this.timer = undefined;
        }
      );
    }
  }
  goBack(): void {
    this.router.navigate(['/sign-in']);
  }

}
