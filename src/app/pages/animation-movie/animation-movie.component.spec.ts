import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimationMovieComponent } from './animation-movie.component';

describe('AnimationMovieComponent', () => {
  let component: AnimationMovieComponent;
  let fixture: ComponentFixture<AnimationMovieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimationMovieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimationMovieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
