import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

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
