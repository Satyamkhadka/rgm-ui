import { TestBed } from '@angular/core/testing';

import { LocalBodyService } from './local-body.service';

describe('LocalBodyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocalBodyService = TestBed.get(LocalBodyService);
    expect(service).toBeTruthy();
  });
});
