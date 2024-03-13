import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicShareComponent } from './public-share.component';

describe('PublicShareComponent', () => {
  let component: PublicShareComponent;
  let fixture: ComponentFixture<PublicShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublicShareComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublicShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
