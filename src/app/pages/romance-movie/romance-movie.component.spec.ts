import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RomanceMovieComponent } from './romance-movie.component';

describe('RomanceMovieComponent', () => {
  let component: RomanceMovieComponent;
  let fixture: ComponentFixture<RomanceMovieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RomanceMovieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RomanceMovieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
