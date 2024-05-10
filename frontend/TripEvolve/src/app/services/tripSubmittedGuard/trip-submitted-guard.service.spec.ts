import { TestBed } from '@angular/core/testing';

import { TripSubmittedGuardService } from './trip-submitted-guard.service';

describe('TripSubmittedGuardService', () => {
  let service: TripSubmittedGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TripSubmittedGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
