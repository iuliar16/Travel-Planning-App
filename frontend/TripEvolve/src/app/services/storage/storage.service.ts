import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Subject } from 'rxjs';

const USER_KEY = 'auth_user';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(
    @Inject(DOCUMENT) private _doc: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private isLoggedInSubject = new Subject<boolean>();
  private getWindow(): Window | null {
    if (isPlatformBrowser(this.platformId)) {
      return this._doc.defaultView;
    }
    return null;
  }

  clean(): void {
    this.getWindow()?.sessionStorage.clear();
  }

  public saveUser(user: any): void {
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    this.isLoggedInSubject.next(true); // Emite eveniment pentru notificarea componentelor
  }

  public getUser(): any {
    const user = this.getWindow()?.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }

  public getUserRole(): string {
    const user = this.getUser();
    return user ? user.role : 'ADMIN';
  }
  public isUserAdmin(): boolean {
    const userRole = this.getUserRole();
    return userRole === 'ADMIN';
  }

  public isLoggedIn(): boolean {
    const user = this.getWindow()?.sessionStorage.getItem(USER_KEY);
    // console.log('IsLoggedIn:', user ? true : false);
    return user ? true : false;
  }

  public logout(): void {
    this.getWindow()?.sessionStorage.removeItem(USER_KEY);
    this.isLoggedInSubject.next(false);
  }
  getIsLoggedInSubject(): Subject<boolean> {
    return this.isLoggedInSubject;
  }
}
