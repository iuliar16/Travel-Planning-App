import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhenDoYouWantToGoComponent } from './when-do-you-want-to-go.component';

describe('WhenDoYouWantToGoComponent', () => {
  let component: WhenDoYouWantToGoComponent;
  let fixture: ComponentFixture<WhenDoYouWantToGoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WhenDoYouWantToGoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WhenDoYouWantToGoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
