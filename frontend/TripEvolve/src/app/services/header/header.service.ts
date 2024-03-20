import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private showHeaderSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public showHeader$: Observable<boolean> = this.showHeaderSubject.asObservable();

  constructor() {}

  setShowHeader(value: boolean): void {
    this.showHeaderSubject.next(value);
  }
}
