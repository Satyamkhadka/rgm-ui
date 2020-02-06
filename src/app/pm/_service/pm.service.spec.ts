import { TestBed } from '@angular/core/testing';

import { PmService } from './pm.service';

describe('PmService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PmService = TestBed.get(PmService);
    expect(service).toBeTruthy();
  });
});
