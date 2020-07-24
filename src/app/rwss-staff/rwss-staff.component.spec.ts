import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RwssStaffComponent } from './rwss-staff.component';

describe('RwssStaffComponent', () => {
  let component: RwssStaffComponent;
  let fixture: ComponentFixture<RwssStaffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RwssStaffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RwssStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
