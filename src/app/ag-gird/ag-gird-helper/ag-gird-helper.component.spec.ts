import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgGirdHelperComponent } from './ag-gird-helper.component';

describe('AgGirdHelperComponent', () => {
  let component: AgGirdHelperComponent;
  let fixture: ComponentFixture<AgGirdHelperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgGirdHelperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgGirdHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
