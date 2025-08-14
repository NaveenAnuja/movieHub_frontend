import { Component, OnInit } from '@angular/core';
import { MovieItemComponent } from '../movie-item/movie-item.component';
import { NgFor } from '@angular/common';
import { NavBarComponent } from '../../common/nav-bar/nav-bar.component';
import { environment } from '../../../../enviroment';

@Component({
  selector: 'app-horror-movie',
  standalone: true,
  imports: [MovieItemComponent, NgFor, NavBarComponent],
  templateUrl: './horror-movie.component.html',
  styleUrl: './horror-movie.component.css'
})
export class HorrorMovieComponent implements OnInit {

  public movieList: any = []

  ngOnInit(): void {
    this.loadMovieInfo();
  }

  loadMovieInfo() {
    fetch(`${environment.apiBaseUrl}/movie/search-by-category/HORROR`)
      .then(res => res.json())
      .then(data => {

        if (data && data.movies) {
          this.movieList = data.movies;
        } else {
          this.movieList = [];
        }
      })
      .catch(error => console.error(error));
  }

}
