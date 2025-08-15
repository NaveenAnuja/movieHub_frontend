import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../enviroment';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Suggestion } from '../models/suggestion.model';
import { EditSuggestionComponent } from '../edit-suggestion/edit-suggestion.component';

@Component({
  selector: 'app-suggetion',
  standalone: true,
  imports: [RouterLink, HttpClientModule, CommonModule, FormsModule],
  templateUrl: './suggetion.component.html',
  styleUrls: ['./suggetion.component.css']
})
export class SuggetionComponent {

  public suggetionId: string = '';
  public suggestionList: any[] = [];

  constructor(private http: HttpClient, private modalService: NgbModal) {
    this.loadList();
  }

  public loadList() {
    this.http.get<any>(`${environment.apiBaseUrl}/suggestion/view/suggestions`)
      .subscribe({
        next: (data) => {
          this.suggestionList = Array.isArray(data) ? data : (data?.data || []);
        },
        error: (err) => {
          console.error('Error loading suggestions:', err);
          this.suggestionList = [];
        }
      });
  }

  public deleteSuggetions(id: number) {
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
        this.performDelete(id);
      }
    });
  }

  private performDelete(id: number) {
    console.log('Attempting to delete suggestion with ID:', id);

    this.http.delete(`${environment.apiBaseUrl}/suggestion/delete/suggestion/${id}`, {
      observe: 'response',
      responseType: 'text'
    }).subscribe({
      next: (response) => {
        console.log('Delete response:', response);

        if (response.status >= 200 && response.status < 300) {
          Swal.fire({
            icon: 'success',
            title: 'Suggestion deleted successfully!',
            timer: 2000,
            showConfirmButton: true
          });
          this.loadList();
        } else {
          this.handleDeleteError(`Unexpected status code: ${response.status}`);
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error deleting suggestion:', err);

        let errorMessage = 'Failed to delete suggestion';

        if (err.status === 500) {
          errorMessage = 'Internal server error. Please check the backend logs.';
        } else if (err.status === 404) {
          errorMessage = 'Suggestion not found. It may have already been deleted.';
        } else if (err.status === 403) {
          errorMessage = 'You do not have permission to delete this suggestion.';
        } else if (err.status === 0) {
          errorMessage = 'Unable to connect to server. Please check your connection.';
        } else {
          errorMessage = `Server error: ${err.status} ${err.statusText}`;
        }

        this.handleDeleteError(errorMessage);
      }
    });
  }

  private handleDeleteError(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Delete Failed',
      text: message,
      showConfirmButton: true
    });
  }

  public searchComment() {
    if (!this.suggetionId.trim()) {
      this.loadList();
      return;
    }

    this.http.get<any>(`${environment.apiBaseUrl}/suggestion/search/suggestion-by-id/${this.suggetionId}`)
      .subscribe({
        next: (res) => {
          this.suggestionList = Array.isArray(res) ? res : [res];
          console.log('Search result:', this.suggestionList);
          this.suggetionId = '';
        },
        error: (err: HttpErrorResponse) => {
          console.error('Search error:', err);
          Swal.fire({
            icon: 'warning',
            title: `Comment not found for id: ${this.suggetionId}`,
            showConfirmButton: true
          });
          this.loadList();
          this.suggetionId = '';
        }
      });
  }

  openEditSuggestion(suggestion: Suggestion): void {
    const modalRef = this.modalService.open(EditSuggestionComponent, { size: 'lg' });
    modalRef.componentInstance.suggestion = suggestion;

    modalRef.result.then(
      (result) => result === 'updated' && this.loadList(),
      () => { }
    );
  }

  getUserName(suggestion: any): string {
    return suggestion?.userRequest?.name || 'N/A';
  }

  getUserId(suggestion: any): string {
    return suggestion?.userRequest?.id?.toString() || 'N/A';
  }

  getMovieName(suggestion: any): string {
    return suggestion?.movieRequest?.movieName || 'N/A';
  }

  getMovieId(suggestion: any): string {
    return suggestion?.movieRequest?.id?.toString() || 'N/A';
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  }

  formatTime(dateString: string): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString();
    } catch (error) {
      return 'Invalid Time';
    }
  }
}