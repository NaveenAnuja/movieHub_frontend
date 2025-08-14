import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DramaMovieComponent } from './drama-movie.component';

describe('DramaMovieComponent', () => {
  let component: DramaMovieComponent;
  let fixture: ComponentFixture<DramaMovieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DramaMovieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DramaMovieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
