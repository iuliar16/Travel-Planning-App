import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private apiUrl = 'http://localhost:8080';
  constructor(private http: HttpClient) {}

  sendRegistrationEmail(emailDetails: any): Observable<any> {
    const url = `${this.apiUrl}/sendMailWithAttachment`;
    return this.http.post<any>(url, emailDetails);
  }
}
