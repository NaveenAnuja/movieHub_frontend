import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../../enviroment';
import Swal from 'sweetalert2';
import { MovieCategory } from '../movie/movieCategory.enum';

@Component({
  selector: 'app-add-movie',
  standalone: true,
  imports: [RouterLink, HttpClientModule, FormsModule, CommonModule],
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.css']
})
export class AddMovieComponent {

  constructor(private http: HttpClient, private router: Router) { }

  categories = Object.values(MovieCategory);

  public movie = {
    movieName: "",
    description: "",
    rate: "",
    category: "",
    imageUrl: "" 
  }

  public addMovie() {
  const page = 0;
  const size = 1000;

  this.http.get<any>(`${environment.apiBaseUrl}/movie/view/movies/page/${page}/size/${size}`)
    .subscribe((data) => {
      const movieList = data.movies;

      const duplicateMovie = movieList.find(
        (m: any) =>
          m.movieName === this.movie.movieName || m.description === this.movie.description
      );

      if (duplicateMovie) {
        alert("This Movie is already added. Please add a different movie!");
        this.clearFields();
      } else {
        const token = localStorage.getItem("token");

        const headers = {
          Authorization: `Bearer ${token}`
        };

        this.http.post(`${environment.apiBaseUrl}/movie/add/movie`, this.movie, { headers })
          .subscribe(() => {
            Swal.fire({
              icon: 'success',
              title: 'Movie Added successfully!',
              timer: 2000,
              showConfirmButton: true
            });
            this.router.navigate(['/movie']);
          }, (err) => {
            console.error('Add movie error:', err);
            Swal.fire({
              icon: 'error',
              title: 'Failed to add movie!',
              text: err.error?.message || 'Internal server error'
            });
          });
      }
    });
}


  private clearFields() {
    this.movie.movieName = "";
    this.movie.description = "";
    this.movie.rate = "";
    this.movie.category = "";
    this.movie.imageUrl = "";
  }
}
