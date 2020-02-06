import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllcontractComponent } from './allcontract.component';

describe('AllcontractComponent', () => {
  let component: AllcontractComponent;
  let fixture: ComponentFixture<AllcontractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllcontractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllcontractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
