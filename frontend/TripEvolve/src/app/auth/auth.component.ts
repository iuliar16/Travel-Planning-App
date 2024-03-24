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
  constructor(private elementRef: ElementRef) {}
  ngAfterViewInit() {
      this.elementRef.nativeElement.ownerDocument
          .body.style.backgroundColor = 'rgb(200, 210, 220)';
  }
}
