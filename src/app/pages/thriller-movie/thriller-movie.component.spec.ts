import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThrillerMovieComponent } from './thriller-movie.component';

describe('ThrillerMovieComponent', () => {
  let component: ThrillerMovieComponent;
  let fixture: ComponentFixture<ThrillerMovieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThrillerMovieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThrillerMovieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
