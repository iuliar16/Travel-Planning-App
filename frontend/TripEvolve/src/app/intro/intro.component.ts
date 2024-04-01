import { Component } from '@angular/core';
import { StorageService } from '../services/storage/storage.service';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrl: './intro.component.css'
})
export class IntroComponent {
  isLoggedIn: boolean;
  constructor(private storageService: StorageService){
    this.isLoggedIn = this.storageService.isLoggedIn();
  }
}
