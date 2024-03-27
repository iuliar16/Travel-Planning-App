import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  ImagePath: string;
  public showLogout: boolean = false;

  constructor() { 
    this.ImagePath = '../../assets/images/logo.png';
  }
  onClickIcon(): void {
    this.showLogout = !this.showLogout;
  }

  ngOnInit(): void {
  }

  toggleDropdown(): void {
  
  }


}
