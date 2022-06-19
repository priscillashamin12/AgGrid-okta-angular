import { TestBed, inject } from '@angular/core/testing';

import { TrdService } from './trd.service';

describe('TrdService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrdService]
    });
  });

  it('should be created', inject([TrdService], (service: TrdService) => {
    expect(service).toBeTruthy();
  }));
});
