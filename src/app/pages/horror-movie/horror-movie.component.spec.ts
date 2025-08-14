import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorrorMovieComponent } from './horror-movie.component';

describe('HorrorMovieComponent', () => {
  let component: HorrorMovieComponent;
  let fixture: ComponentFixture<HorrorMovieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorrorMovieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorrorMovieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
