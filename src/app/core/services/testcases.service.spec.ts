import { TestBed, inject } from '@angular/core/testing';

import { TestcasesService } from './testcases.service';

describe('TestcasesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TestcasesService]
    });
  });

  it('should be created', inject([TestcasesService], (service: TestcasesService) => {
    expect(service).toBeTruthy();
  }));
});
