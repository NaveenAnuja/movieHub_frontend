import { Component, Input } from '@angular/core';
import { tick } from '@angular/core/testing';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../enviroment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-movie-item',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './movie-item.component.html',
  styleUrls: ['./movie-item.component.css']
})
export class MovieItemComponent {

  @Input()
  public movieInfo: any;

async viewMovie() {
  try {
    const response = await fetch(`${environment.apiBaseUrl}/movie/search-by-id/${this.movieInfo.id}`);
    const data = await response.json();

    if (data && data.movieName) {
      await Swal.fire({
        icon: 'success',
        title: `🎬 Redirecting to YouTube for "${data.movieName}"...`,
        timer: 2000,
        showConfirmButton: false, 
        didOpen: () => {
          Swal.showLoading();  
        }
      });

      const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(data.movieName + " full movie")}`;
      window.open(youtubeSearchUrl, '_blank');  

    } else {
      Swal.fire({
        icon: 'error',
        title: 'Movie Not Found',
        text: 'Could not find the movie details.'
      });
    }
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'An error occurred. Please try again later.'
    });
  }
}



  saveMovieInfo() {
    localStorage.setItem("selectedMovie", JSON.stringify(this.movieInfo));
  }

}
