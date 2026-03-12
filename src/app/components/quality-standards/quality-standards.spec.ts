import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityStandards } from './quality-standards';

describe('QualityStandards', () => {
  let component: QualityStandards;
  let fixture: ComponentFixture<QualityStandards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QualityStandards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QualityStandards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
