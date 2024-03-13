import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrl: './forgot-pass.component.css'
})
export class ForgotPassComponent {
  formData = {
    email: '',
  };
  constructor(private router: Router) {}

  onSubmit() {
    console.log('Form submitted with data:', this.formData);
  }
  goBack(): void {
    this.router.navigate(['/sign-in']);
  }

}
