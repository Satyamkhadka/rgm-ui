import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllmemoComponent } from './allmemo.component';

describe('AllmemoComponent', () => {
  let component: AllmemoComponent;
  let fixture: ComponentFixture<AllmemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllmemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllmemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
