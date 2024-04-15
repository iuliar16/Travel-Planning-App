import { TestBed } from '@angular/core/testing';

import { SaveItineraryService } from './save-itinerary.service';

describe('SaveItineraryService', () => {
  let service: SaveItineraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveItineraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
