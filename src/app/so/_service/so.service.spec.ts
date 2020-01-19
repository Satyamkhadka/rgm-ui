import { TestBed } from '@angular/core/testing';

import { SoService } from './so.service';

describe('SoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SoService = TestBed.get(SoService);
    expect(service).toBeTruthy();
  });
});
