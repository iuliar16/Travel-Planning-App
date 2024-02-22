import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleItineraryComponent } from './schedule-itinerary.component';

describe('ScheduleItineraryComponent', () => {
  let component: ScheduleItineraryComponent;
  let fixture: ComponentFixture<ScheduleItineraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScheduleItineraryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScheduleItineraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
