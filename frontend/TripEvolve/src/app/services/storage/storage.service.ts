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
    this.getWindow()?.localStorage.clear();
  }

  public saveUser(user: any): void {
    this.getWindow()?.sessionStorage.removeItem(USER_KEY);
    this.getWindow()?.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    this.isLoggedInSubject.next(true); // Emit event to notify components
  }

  public saveUserWithPersistence(user: any): void {
    this.getWindow()?.localStorage.removeItem(USER_KEY);
    this.getWindow()?.localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.isLoggedInSubject.next(true); // // Emit event to notify components
  }

  public getUser(): any {
    const sessionUser = this.getWindow()?.sessionStorage.getItem(USER_KEY);
    if (sessionUser) {
      return JSON.parse(sessionUser);
    }
    const localUser = this.getWindow()?.localStorage.getItem(USER_KEY);
    if (localUser) {
      return JSON.parse(localUser);
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
    const sessionUser = this.getWindow()?.sessionStorage.getItem(USER_KEY);
    const localUser = this.getWindow()?.localStorage.getItem(USER_KEY);
    return !!sessionUser || !!localUser;
  }

  public logout(): void {
    this.getWindow()?.sessionStorage.removeItem(USER_KEY);
    this.getWindow()?.localStorage.removeItem(USER_KEY);
    this.isLoggedInSubject.next(false);
  }

  getIsLoggedInSubject(): Subject<boolean> {
    return this.isLoggedInSubject;
  }
}
