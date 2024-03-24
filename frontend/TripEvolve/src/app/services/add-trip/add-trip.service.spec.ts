import { TestBed } from '@angular/core/testing';

import { AddTripService } from './add-trip.service';

describe('AddTripService', () => {
  let service: AddTripService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddTripService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
