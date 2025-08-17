import { Component, OnInit } from '@angular/core';
import { MovieItemComponent } from '../movie-item/movie-item.component';
import { NgFor } from '@angular/common';
import { NavBarComponent } from '../../common/nav-bar/nav-bar.component';
import { environment } from '../../../../enviroment';

@Component({
  selector: 'app-kids-movie',
  standalone: true,
  imports: [MovieItemComponent, NgFor, NavBarComponent],
  templateUrl: './kids-movie.component.html',
  styleUrl: './kids-movie.component.css'
})
export class KidsMovieComponent implements OnInit {

  public movieList: any = []

  ngOnInit(): void {
    this.loadMovieInfo();
  }

  loadMovieInfo() {
  fetch(`${environment.apiBaseUrl}/movie/search-by-category/KIDS`)
    .then(res => res.json())
    .then(data => {
      if (data && data.movies) {
        this.movieList = data.movies;
        console.log(this.movieList);
      } else {
        this.movieList = [];
      }
    })
    .catch(error => console.error(error));
}


}
