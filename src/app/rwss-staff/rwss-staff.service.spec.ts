import { TestBed } from '@angular/core/testing';

import { RwssStaffService } from './rwss-staff.service';

describe('RwssStaffService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RwssStaffService = TestBed.get(RwssStaffService);
    expect(service).toBeTruthy();
  });
});
