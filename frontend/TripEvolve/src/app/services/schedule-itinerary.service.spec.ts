import { TestBed } from '@angular/core/testing';

import { ScheduleItineraryService } from './schedule-itinerary.service';

describe('ScheduleItineraryService', () => {
  let service: ScheduleItineraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScheduleItineraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
