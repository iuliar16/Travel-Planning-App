import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { StorageService } from '../services/storage/storage.service';
import { Router } from '@angular/router';
import { SignOutPopupComponent } from '../sign-out-popup/sign-out-popup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  ImagePath: string;
  public showLogout: boolean = false;
  showLogoutPopup: boolean = false;
  isLoggedIn: boolean;

  userRole: string = 'ADMIN';

  private isLoggedInSubscription!: Subscription;

  constructor(public dialog: MatDialog, private storageService: StorageService, private router: Router) {
    this.ImagePath = '../../assets/images/logo.png';
    this.isLoggedIn = this.storageService.isLoggedIn();
  }
  onClickIcon(): void {
    this.showLogout = !this.showLogout;
  }

  ngOnInit(): void {
    this.updateLoggedInStatus();
    this.isLoggedInSubscription = this.storageService
      .getIsLoggedInSubject()
      .subscribe((isLoggedIn) => {
        this.isLoggedIn = isLoggedIn;
        this.userRole = this.storageService.getUserRole();
        this.router.navigate(['/home']);
      });
  }

  ngOnDestroy(): void {
    if (this.isLoggedInSubscription) {
      this.isLoggedInSubscription.unsubscribe();
    }
  }
  logOut(): void {
    this.showLogoutPopup = true;
  }

  private updateLoggedInStatus(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    this.userRole = this.storageService.getUserRole();
  }

  openSignOutDialog(): void {
    const dialogRef = this.dialog.open(SignOutPopupComponent, {
      width: '700px',
      height: '175px',
      position: {
        top: '-480px',
        left: '31%'
      },
      backdropClass: 'bdrop',
      autoFocus: false,
    });

    this.showLogoutPopup = true;

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.showLogoutPopup = false;
    });
  }

}
