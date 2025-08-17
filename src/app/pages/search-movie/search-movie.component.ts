import { Component, OnInit } from '@angular/core';
import { MovieItemComponent } from '../movie-item/movie-item.component';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavBarComponent } from '../../common/nav-bar/nav-bar.component';
import { environment } from '../../../../enviroment';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-search-movie',
  standalone: true,
  imports: [MovieItemComponent, NgFor, FormsModule, NavBarComponent],
  templateUrl: './search-movie.component.html',
  styleUrls: ['./search-movie.component.css']
})
export class SearchMovieComponent {
  movieName: string = '';
  movieList: any[] = [];

  searchMovie() {
    fetch(`${environment.apiBaseUrl}/movie/search-by-name/${this.movieName}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.id) {
          this.movieList = [data];
        } else {
          this.movieList = [];
          Swal.fire({
            icon: 'error',
            title: 'Movie Not Found',
            text: `No movie found with the name "${this.movieName}".`,
          });
        }
      })
      .catch(error => {
        console.error(error);
        this.movieList = [];
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred. Please try again later.',
        });
      });
  }

}

