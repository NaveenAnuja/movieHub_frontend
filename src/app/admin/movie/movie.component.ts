import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MovieCategory } from './movieCategory.enum';
import { EditMovieComponent } from '../edit-movie/edit-movie.component';
import { MovieItemComponent } from '../../pages/movie-item/movie-item.component';
import { environment } from '../../../../enviroment';
import { Movie } from '../models/movie.model';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [
    NgFor, 
    MovieItemComponent, 
    RouterLink, 
    FormsModule, 
    CommonModule
  ],
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {
  // Component state
  movieList: Movie[] = [];
  searchValue = '';
  selectedCategory: MovieCategory | null = null;
  
  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalItems = 0;

  // Constants
  readonly categories = Object.values(MovieCategory);

  constructor(
    private http: HttpClient,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  // Main data loading method
  loadMovies(page: number = this.currentPage, size: number = this.pageSize): void {
    this.http.get<MovieResponse>(`${environment.apiBaseUrl}/movie/view/movies/page/${page}/size/${size}`)
      .subscribe({
        next: (data) => this.handleMovieResponse(data),
        error: () => this.showError('Failed to load movies')
      });
  }

  // Search methods
  searchMovie(): void {
    if (!this.searchValue.trim()) {
      this.resetSearch();
      return;
    }

    const searchMethod = isNaN(Number(this.searchValue)) 
      ? () => this.searchByName(this.searchValue)
      : () => this.searchById(this.searchValue);

    searchMethod();
  }

  searchByCategory(): void {
    if (this.selectedCategory) {
      this.http.get<CategoryResponse>(`${environment.apiBaseUrl}/movie/search-by-category/${this.selectedCategory}`)
        .subscribe({
          next: (data) => this.movieList = data.movies,
          error: (error) => this.showError(error.error || 'Failed to search by category')
        });
    } else {
      this.resetSearch();
    }
  }

  // CRUD operations
  deleteMovie(id: number): void {
    this.showDeleteConfirmation().then((confirmed) => {
      if (confirmed) {
        this.http.delete(`${environment.apiBaseUrl}/movie/delete/movie/${id}`)
          .subscribe({
            next: () => this.handleDeleteSuccess(),
            error: () => this.showError('Failed to delete movie')
          });
      }
    });
  }

  openEditModal(movie: Movie): void {
    const modalRef = this.modalService.open(EditMovieComponent, { size: 'lg' });
    modalRef.componentInstance.movie = movie;
    
    modalRef.result.then(
      (result) => result === 'updated' && this.loadMovies(),
      () => {} 
    );
  }

  // Pagination
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadMovies(page);
  }

  getPagesArray(): number[] {
    const pages = [];
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages - 2, this.currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      if (i > 0 && i < this.totalPages - 1) {
        pages.push(i);
      }
    }

    return pages;
  }

  // Private helper methods
  private searchById(id: string): void {
    this.http.get<Movie>(`${environment.apiBaseUrl}/movie/search-by-id/${id}`)
      .subscribe({
        next: (movie) => this.handleSearchResult([movie]),
        error: () => this.handleSearchError(`Movie not found with ID: ${id}`)
      });
  }

  private searchByName(name: string): void {
    this.http.get<Movie>(`${environment.apiBaseUrl}/movie/search-by-name/${name}`)
      .subscribe({
        next: (movie) => this.handleSearchResult([movie]),
        error: () => this.handleSearchError(`Movie not found with name: ${name}`)
      });
  }

  private handleMovieResponse(data: MovieResponse): void {
    this.movieList = data.movies;
    this.currentPage = data.currentPage;
    this.totalPages = data.totalPages;
    this.totalItems = data.totalItems;
  }

  private handleSearchResult(movies: Movie[]): void {
    this.movieList = movies;
    this.searchValue = '';
  }

  private handleSearchError(message: string): void {
    this.showWarning(message);
    this.resetSearch();
  }

  private handleDeleteSuccess(): void {
    this.showSuccess('Deleted!', 'Movie has been deleted');
    this.loadMovies(this.currentPage);
  }

  private resetSearch(): void {
    this.loadMovies(this.currentPage);
    this.searchValue = '';
  }

  // Alert helpers
  private showDeleteConfirmation(): Promise<boolean> {
    return Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => result.isConfirmed);
  }

  private showSuccess(title: string, text: string): void {
    Swal.fire(title, text, 'success');
  }

  private showWarning(message: string): void {
    Swal.fire({
      icon: 'warning',
      title: message,
      timer: 2000,
      showConfirmButton: true
    });
  }

  private showError(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      timer: 2000
    });
  }
}

// Type interfaces
interface MovieResponse {
  movies: Movie[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

interface CategoryResponse {
  movies: Movie[];
  category: MovieCategory;
  totalCount: number;
}