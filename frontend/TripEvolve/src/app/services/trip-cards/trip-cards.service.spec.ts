import { TestBed } from '@angular/core/testing';

import { TripCardsService } from './trip-cards.service';

describe('TripCardsService', () => {
  let service: TripCardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TripCardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
