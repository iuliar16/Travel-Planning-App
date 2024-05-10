import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

const USER_KEY = 'auth_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private backendUrl = 'http://localhost:8080/api/auth';
  private getWindow(): Window | null {
    if (isPlatformBrowser(this.platformId)) {
      return this._doc.defaultView;
    }
    return null;
  }

  user = this.getWindow()?.sessionStorage.getItem(USER_KEY);

  private isAuthenticated = this.user ? true : false;


  constructor(private http: HttpClient,
    @Inject(DOCUMENT) private _doc: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  forgotPassword(email: any): Observable<any> {
    const url = `${this.backendUrl}/forgot-password?email=${email}`;
    return this.http.get(url);
  }

  resetPassword(password: string, token: string): Observable<any> {
    const pw = {"password":password, token:token}
    const url = `${this.backendUrl}/reset-password`;
    return this.http.post(url, pw, httpOptions);
  }
  confirmEmail(email: string, token: string): Observable<any> {
    const us = {"email":email, token:token}
    const url = `${this.backendUrl}/confirm-email`;
    return this.http.post(url, us, httpOptions);
  }

  signup(user: any): Observable<any> {
    const newUser = { ...user, isEnabled: false };
    const url = `${this.backendUrl}/register`;
    return this.http.post(url, newUser, httpOptions);
  }

  login(user: any): Observable<any> {
    console.log(user);
    const url = `${this.backendUrl}/login`;
    this.isAuthenticated = true;
    return this.http.post(url, user, httpOptions);
  }

  signout() {
    this.isAuthenticated = false;
  }

  isLogin() {
    return this.isAuthenticated;
  }
}
