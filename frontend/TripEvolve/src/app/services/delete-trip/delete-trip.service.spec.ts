import { TestBed } from '@angular/core/testing';

import { DeleteTripService } from './delete-trip.service';

describe('DeleteTripService', () => {
  let service: DeleteTripService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeleteTripService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
