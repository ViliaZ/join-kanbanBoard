import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoAnimationComponent } from './logo-animation.component';

describe('LogoAnimationComponent', () => {
  let component: LogoAnimationComponent;
  let fixture: ComponentFixture<LogoAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogoAnimationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
