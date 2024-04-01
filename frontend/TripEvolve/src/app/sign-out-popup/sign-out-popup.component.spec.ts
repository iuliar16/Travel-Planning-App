import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignOutPopupComponent } from './sign-out-popup.component';

describe('SignOutPopupComponent', () => {
  let component: SignOutPopupComponent;
  let fixture: ComponentFixture<SignOutPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignOutPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SignOutPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
