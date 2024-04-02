import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private backendUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

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
    return this.http.post(url, user, httpOptions);
  }
}
