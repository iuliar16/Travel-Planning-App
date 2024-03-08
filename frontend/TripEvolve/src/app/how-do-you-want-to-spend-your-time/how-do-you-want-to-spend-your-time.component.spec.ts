import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowDoYouWantToSpendYourTimeComponent } from './how-do-you-want-to-spend-your-time.component';

describe('HowDoYouWantToSpendYourTimeComponent', () => {
  let component: HowDoYouWantToSpendYourTimeComponent;
  let fixture: ComponentFixture<HowDoYouWantToSpendYourTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HowDoYouWantToSpendYourTimeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HowDoYouWantToSpendYourTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
