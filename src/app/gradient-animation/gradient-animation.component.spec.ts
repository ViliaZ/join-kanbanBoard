import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradientAnimationComponent } from './gradient-animation.component';

describe('GradientAnimationComponent', () => {
  let component: GradientAnimationComponent;
  let fixture: ComponentFixture<GradientAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradientAnimationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradientAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
