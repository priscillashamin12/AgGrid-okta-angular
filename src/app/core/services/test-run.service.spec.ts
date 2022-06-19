import { TestBed } from '@angular/core/testing';

import { TestRunService } from './test-run.service';

describe('TestRunService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TestRunService = TestBed.get(TestRunService);
    expect(service).toBeTruthy();
  });
});
