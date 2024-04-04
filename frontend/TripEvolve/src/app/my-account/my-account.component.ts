import { Component } from '@angular/core';
import { StorageService } from '../services/storage/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css'
})
export class MyAccountComponent {
  utilizator = {
    username: 'username',
    firstname: 'Prenume',
    lastname: 'Nume',
    email: 'email@example.com',
  };
  constructor(private router: Router, private storageService: StorageService) {}

  ngOnInit(): void {
    this.utilizator = this.storageService.getUser();
  }
  goBack(): void {
    this.router.navigate(['/home']);
  }
}
