import { TestBed, inject } from '@angular/core/testing';

import { TestPlanGrpService } from './test-plan-grp.service';

describe('TestPlanGrpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TestPlanGrpService]
    });
  });

  it('should be created', inject([TestPlanGrpService], (service: TestPlanGrpService) => {
    expect(service).toBeTruthy();
  }));
});
