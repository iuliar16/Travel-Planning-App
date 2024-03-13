import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareTripPopupComponent } from './share-trip-popup.component';

describe('ShareTripPopupComponent', () => {
  let component: ShareTripPopupComponent;
  let fixture: ComponentFixture<ShareTripPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShareTripPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShareTripPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
