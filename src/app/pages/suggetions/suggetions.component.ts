import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../../enviroment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-suggetions',
  standalone: true,
  imports: [RouterLink, FormsModule, HttpClientModule, CommonModule],
  templateUrl: './suggetions.component.html',
  styleUrls: ['./suggetions.component.css']
})
export class SuggetionsComponent implements OnInit {

  public comments = {
    comment: '',
    userRequest: { id: '' },
    movieRequest: { id: '' }
  };

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    try {
      const userDataString = localStorage.getItem("userData");
      if (userDataString && userDataString !== 'undefined') {
        const userData = JSON.parse(userDataString);
        this.comments.userRequest.id = userData.id?.toString() || '';
      }

      const selectedMovieString = localStorage.getItem("selectedMovie");
      if (selectedMovieString && selectedMovieString !== 'undefined') {
        const selectedMovie = JSON.parse(selectedMovieString);
        this.comments.movieRequest.id = selectedMovie.id?.toString() || '';
      }
    } catch (error) {
      console.error('Error initializing component:', error);
    }
  }

  public addSuggestion() {
    if (
      !this.comments.userRequest.id ||
      !this.comments.movieRequest.id ||
      !this.comments.comment.trim()
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please fill in all fields before submitting.'
      });
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Not Logged In',
        text: 'Please log in before commenting.'
      });
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.post(
      `${environment.apiBaseUrl}/suggestion/add/suggestions`,
      this.comments,
      { headers }
    ).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Comment Added Successfully!',
          text: 'Thank you for your comment.',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/popular']);
        });
      },
      error: (error) => {
        console.error('Detailed Error:', error);

        if (error.status === 403) {
          Swal.fire({
            icon: 'error',
            title: 'Access Denied',
            text: 'You do not have permission to add a suggestion. Please log in with the correct account.'
          });
        } else if (error.status === 401) {
          Swal.fire({
            icon: 'error',
            title: 'Unauthorized',
            text: 'Your session may have expired. Please log in again.'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error adding comment',
            text: 'Please try again later.'
          });
        }
      }
    });
  }
}
