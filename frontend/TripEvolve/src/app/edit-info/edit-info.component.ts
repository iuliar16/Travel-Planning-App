import { Component } from '@angular/core';
import { StorageService } from '../services/storage/storage.service';

@Component({
  selector: 'app-edit-info',
  templateUrl: './edit-info.component.html',
  styleUrl: './edit-info.component.css'
})
export class EditInfoComponent {
  utilizator = {
    firstname: 'Prenume',
    lastname: 'Nume',
    email: 'email@example.com',
  };
  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    this.utilizator = this.storageService.getUser();
  }
}
