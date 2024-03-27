import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTripPopupComponent } from './delete-trip-popup.component';

describe('DeleteTripPopupComponent', () => {
  let component: DeleteTripPopupComponent;
  let fixture: ComponentFixture<DeleteTripPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteTripPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteTripPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
