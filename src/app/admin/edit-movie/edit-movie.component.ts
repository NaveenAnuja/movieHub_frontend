import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../enviroment';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MovieCategory } from '../movie/movieCategory.enum';

@Component({
  selector: 'app-edit-movie-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-movie.component.html',
  styleUrls: ['./edit-movie.component.css']
})
export class EditMovieComponent {
  @Input() movie: any;
  public movieCategories = Object.values(MovieCategory); 

  constructor(
    public activeModal: NgbActiveModal,
    private http: HttpClient
  ) {}

  updateMovie() {
    const updateRequest = {
      description: this.movie.description,
      rate: this.movie.rate,
      category: this.movie.category, 
      imageUrl: this.movie.imageUrl
    };

    console.log(updateRequest)
    this.http.put(`${environment.apiBaseUrl}/movie/update/movie/${this.movie.id}`, updateRequest)
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Movie updated successfully!',
            timer: 2000,
            showConfirmButton: true
          });
          this.activeModal.close('updated');
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Error updating movie',
            timer: 2000,
            showConfirmButton: true
          });
        }
      });
  }
  
  getCategoryDisplayName(movieCategory: string): string {
    return movieCategory.replace(/_/g, ' '); 
  }
}
