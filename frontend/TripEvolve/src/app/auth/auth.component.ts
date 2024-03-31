import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  formData = {
    firstname: '',
    lastname: '',
    email: '',
    password: ''
  };
  onSubmit() {
    console.log('Form submitted with data:', this.formData);
  }
 
}
