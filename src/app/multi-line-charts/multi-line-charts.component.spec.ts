import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiLineChartsComponent } from './multi-line-charts.component';

describe('MultiLineChartsComponent', () => {
  let component: MultiLineChartsComponent;
  let fixture: ComponentFixture<MultiLineChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiLineChartsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiLineChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
