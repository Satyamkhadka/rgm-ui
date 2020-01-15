import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalBodyComponent } from './local-body.component';

describe('LocalBodyComponent', () => {
  let component: LocalBodyComponent;
  let fixture: ComponentFixture<LocalBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
