import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MovieItemComponent } from '../movie-item/movie-item.component';
import { NavBarComponent } from '../../common/nav-bar/nav-bar.component';
import { environment } from '../../../../enviroment';

@Component({
  selector: 'app-thriller-movie',
  standalone: true,
  imports: [MovieItemComponent,NgFor,NavBarComponent],
  templateUrl: './thriller-movie.component.html',
  styleUrl: './thriller-movie.component.css'
})
export class ThrillerMovieComponent implements OnInit{

  public movieList: any = []

  ngOnInit(): void {
    this.loadMovieInfo();
  }

  loadMovieInfo() {
      fetch(`${environment.apiBaseUrl}/movie/search-by-category/THRILLER`)
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
