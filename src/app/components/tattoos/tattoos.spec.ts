import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tattoos } from './tattoos';

describe('Tattoos', () => {
  let component: Tattoos;
  let fixture: ComponentFixture<Tattoos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tattoos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tattoos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
