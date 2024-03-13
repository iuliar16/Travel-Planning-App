import { Component } from '@angular/core';

@Component({
  selector: 'app-edit-info',
  templateUrl: './edit-info.component.html',
  styleUrl: './edit-info.component.css'
})
export class EditInfoComponent {
  formData = {
    email: '',
    firstname: '',
    lastname:''
  };
  onSubmit() {
    console.log('Form submitted with data:', this.formData);
  }
}
