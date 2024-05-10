import { Component } from '@angular/core';
import { StorageService } from '../services/storage/storage.service';
import { HeaderService } from '../services/header/header.service';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrl: './intro.component.css'
})
export class IntroComponent {
  isLoggedIn: boolean;
  constructor(private headerService: HeaderService,
    private storageService: StorageService){
    this.isLoggedIn = this.storageService.isLoggedIn();
  }
  ngOnInit(): void {
    this.headerService.setShowHeader(true);
  }
}
