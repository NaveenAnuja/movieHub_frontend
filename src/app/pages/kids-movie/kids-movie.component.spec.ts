import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KidsMovieComponent } from './kids-movie.component';

describe('KidsMovieComponent', () => {
  let component: KidsMovieComponent;
  let fixture: ComponentFixture<KidsMovieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KidsMovieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KidsMovieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
