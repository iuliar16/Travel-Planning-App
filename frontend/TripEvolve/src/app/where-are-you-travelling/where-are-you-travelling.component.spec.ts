import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhereAreYouTravellingComponent } from './where-are-you-travelling.component';

describe('WhereAreYouTravellingComponent', () => {
  let component: WhereAreYouTravellingComponent;
  let fixture: ComponentFixture<WhereAreYouTravellingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WhereAreYouTravellingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WhereAreYouTravellingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
