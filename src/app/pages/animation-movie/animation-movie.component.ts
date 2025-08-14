import { Component, OnInit } from '@angular/core';
import { MovieItemComponent } from '../movie-item/movie-item.component';
import { NgFor } from '@angular/common';
import { NavBarComponent } from '../../common/nav-bar/nav-bar.component';

@Component({
  selector: 'app-animation-movie',
  standalone: true,
  imports: [MovieItemComponent,NgFor,NavBarComponent],
  templateUrl: './animation-movie.component.html',
  styleUrl: './animation-movie.component.css'
})
export class AnimationMovieComponent implements OnInit {

  public movieList: any = []

  ngOnInit(): void {
    this.loadMovieInfo();
  }

  loadMovieInfo() {
    fetch(`http://localhost:8082/api/movie/search-by-category/ANIMATION`)
      .then(res => res.json())
      .then(data => {

        if (data && data.movies) {
          this.movieList = data.movies;
        } else {
          this.movieList = []
        }
      })
      .catch(error => console.error(error));
  }

}
