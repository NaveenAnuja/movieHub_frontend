import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MovieItemComponent } from '../../pages/movie-item/movie-item.component';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../enviroment';
import Swal from 'sweetalert2';
import { MovieCategory } from './movieCategory.enum';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [NgFor, MovieItemComponent, RouterLink, FormsModule, HttpClientModule, CommonModule],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.css'
})
export class MovieComponent implements OnInit {

  ngOnInit(): void {
    this.loadMovieInfo(0, 10); // Load first page with 10 items
  }

  public movieId: string = '';
  public movieList: any = [];
  public currentPage: number = 0;
  public pageSize: number = 10;
  public totalPages: number = 0;
  public totalItems: number = 0;
  public searchValue: string = '';
  public categories = Object.values(MovieCategory);
  public selectedCategory: MovieCategory | null = null;

  constructor(private http: HttpClient) { }

  public loadMovieInfo(page: number, size: number) {
    this.http.get(`${environment.apiBaseUrl}/movie/view/movies/page/${page}/size/${size}`).subscribe((data: any) => {
      this.movieList = data.movies;
      this.currentPage = data.currentPage;
      this.totalPages = data.totalPages;
      this.totalItems = data.totalItems;
    });
  }

  public onPageChange(page: number) {
    this.currentPage = page;
    this.loadMovieInfo(page, this.pageSize);
  }

  public searchMovie() {
    if (!this.searchValue.trim()) {
      this.loadMovieInfo(this.currentPage, this.pageSize);
      return;
    }

    if (!isNaN(Number(this.searchValue))) {
      this.searchMovieById(this.searchValue);
    } else {
      this.searchMovieByName(this.searchValue);
    }
  }

  private searchMovieById(id: string) {
    this.http.get(`${environment.apiBaseUrl}/movie/search-by-id/${id}`).subscribe({
      next: (data: any) => {
        this.movieList = [data];
        this.searchValue = '';
      },
      error: () => {
        Swal.fire({
          icon: 'warning',
          title: `Movie not found with ID: ${id}`,
          timer: 2000,
          showConfirmButton: true
        });
        this.loadMovieInfo(this.currentPage, this.pageSize);
        this.searchValue = '';
      }
    });
  }

  private searchMovieByName(name: string) {
    this.http.get(`${environment.apiBaseUrl}/movie/search-by-name/${name}`).subscribe({
      next: (data: any) => {
        this.movieList = [data];
        this.searchValue = '';
      },
      error: () => {
        Swal.fire({
          icon: 'warning',
          title: `Movie not found with name: ${name}`,
          timer: 2000,
          showConfirmButton: true
        });
        this.loadMovieInfo(this.currentPage, this.pageSize);
        this.searchValue = '';
      }
    });
  }

  public searchByCategory() {
    if (this.selectedCategory) {
      this.http.get(`${environment.apiBaseUrl}/movie/search-by-category/${this.selectedCategory}`)
        .subscribe({
          next: (data: any) => {
            this.movieList = data.movies;
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.error || 'Failed to search by category',
              timer: 2000
            });
            this.loadMovieInfo(this.currentPage, this.pageSize);
          }
        });
    } else {
      this.loadMovieInfo(this.currentPage, this.pageSize);
    }
  }

  public deleteMovie(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${environment.apiBaseUrl}/movie/delete/movie/${id}`).subscribe(() => {
          Swal.fire(
            'Deleted!',
            'Movie has been deleted.',
            'success'
          );
          this.loadMovieInfo(this.currentPage, this.pageSize);
        });
      }
    });
  }

  public openEditModal(movie: any) {
    // Your edit modal implementation
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
}