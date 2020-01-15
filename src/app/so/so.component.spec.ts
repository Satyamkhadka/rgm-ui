import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoComponent } from './so.component';

describe('SoComponent', () => {
  let component: SoComponent;
  let fixture: ComponentFixture<SoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
